import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();

  const task = await prisma.task.findFirst({
    where: { id },
    include: { project: true },
  });

  if (!task || task.project.userId !== auth.userId) {
    return jsonError("Tarea no encontrada", 404);
  }

  const updated = await prisma.task.update({
    where: { id },
    data: {
      title: body.title?.trim() ?? undefined,
      description: body.description?.trim() ?? undefined,
      status: body.status ?? undefined,
      priority: body.priority ?? undefined,
      blockedBy: body.blockedBy ?? undefined,
      dueAt: body.dueAt ? new Date(body.dueAt) : body.dueAt === null ? null : undefined,
      completedAt:
        body.status === "done"
          ? new Date()
          : body.status && body.status !== "done"
            ? null
            : undefined,
    },
  });

  return Response.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const task = await prisma.task.findFirst({
    where: { id },
    include: { project: true },
  });

  if (!task || task.project.userId !== auth.userId) {
    return jsonError("Tarea no encontrada", 404);
  }

  await prisma.task.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
