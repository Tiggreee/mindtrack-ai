import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError } from "@/lib/api";

export async function GET(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!projectId) {
    return jsonError("projectId es obligatorio");
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: auth.userId },
  });
  if (!project) {
    return jsonError("Proyecto no encontrado", 404);
  }

  const tasks = await prisma.task.findMany({
    where: { projectId },
    orderBy: [{ status: "asc" }, { dueAt: "asc" }],
  });

  return Response.json(tasks);
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { projectId, title, description, status, priority, blockedBy, dueAt } =
    body as {
      projectId?: string;
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      blockedBy?: string;
      dueAt?: string;
    };

  if (!projectId || !title?.trim()) {
    return jsonError("projectId y title son obligatorios");
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: auth.userId },
  });
  if (!project) {
    return jsonError("Proyecto no encontrado", 404);
  }

  const task = await prisma.task.create({
    data: {
      projectId,
      title: title.trim(),
      description: description?.trim() || null,
      status: (status as "todo") ?? "todo",
      priority: (priority as "medium") ?? "medium",
      blockedBy: blockedBy?.trim() || null,
      dueAt: dueAt ? new Date(dueAt) : null,
    },
  });

  return Response.json(task, { status: 201 });
}
