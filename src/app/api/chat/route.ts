import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError } from "@/lib/api";
import { buildProjectContext } from "@/lib/ai/context";
import { completeChat } from "@/lib/ai/llm";
import { embedText } from "@/lib/ai/embeddings";

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { message, projectId, saveNote } = body as {
    message?: string;
    projectId?: string;
    saveNote?: boolean;
  };

  if (!message?.trim()) {
    return jsonError("message es obligatorio");
  }

  let context = "";
  if (projectId) {
    context = await buildProjectContext(projectId, auth.userId);
    if (!context) {
      return jsonError("Proyecto no encontrado", 404);
    }
  }

  const history = await prisma.chatMessage.findMany({
    where: {
      userId: auth.userId,
      projectId: projectId ?? null,
    },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const messages = [
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message.trim() },
  ];

  let reply: string;
  try {
    reply = await completeChat(messages, context || undefined);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error del modelo";
    return jsonError(msg, 503);
  }

  await prisma.chatMessage.createMany({
    data: [
      {
        userId: auth.userId,
        projectId: projectId ?? null,
        role: "user",
        content: message.trim(),
      },
      {
        userId: auth.userId,
        projectId: projectId ?? null,
        role: "assistant",
        content: reply,
      },
    ],
  });

  if (saveNote && projectId) {
    const note = await prisma.note.create({
      data: {
        userId: auth.userId,
        projectId,
        content: message.trim(),
      },
    });

    try {
      const vector = await embedText(note.content);
      const vectorLiteral = `[${vector.join(",")}]`;
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Embedding" (id, "noteId", vector, "createdAt")
         VALUES ($1, $2, $3::vector, NOW())`,
        randomUUID(),
        note.id,
        vectorLiteral,
      );
    } catch {
      // Embedding opcional si falta API key o extensión vector
    }
  }

  return Response.json({ reply, projectId: projectId ?? null });
}
