import { randomUUID } from "node:crypto";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { requireUser, jsonError } from "@/lib/api";
import { buildProjectContext } from "@/lib/ai/context";
import { embedText } from "@/lib/ai/embeddings";
import { getChatModel } from "@/lib/ai/model";
import { getMessageText } from "@/lib/ai/message-text";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = (await req.json()) as {
    messages: UIMessage[];
    projectId?: string;
    saveNote?: boolean;
  };

  const { messages, projectId, saveNote } = body;

  if (!messages?.length) {
    return jsonError("messages es obligatorio");
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const userText = lastUser ? getMessageText(lastUser) : "";

  if (!userText.trim()) {
    return jsonError("mensaje vacío");
  }

  let system: string | undefined;
  if (projectId) {
    const context = await buildProjectContext(projectId, auth.userId);
    if (!context) {
      return jsonError("Proyecto no encontrado", 404);
    }
    system = `Contexto del proyecto:\n${context}\n\nResponde en español. Sé breve y accionable.`;
  } else {
    system = "Responde en español. Sé breve y accionable.";
  }

  const result = streamText({
    model: getChatModel(),
    system,
    messages: await convertToModelMessages(messages),
    onFinish: async ({ text }) => {
      await prisma.chatMessage.createMany({
        data: [
          {
            userId: auth.userId,
            projectId: projectId ?? null,
            role: "user",
            content: userText.trim(),
          },
          {
            userId: auth.userId,
            projectId: projectId ?? null,
            role: "assistant",
            content: text,
          },
        ],
      });

      if (saveNote && projectId) {
        const note = await prisma.note.create({
          data: {
            userId: auth.userId,
            projectId,
            content: userText.trim(),
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
          // sin embedding si Ollama/OpenAI no disponible
        }
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
