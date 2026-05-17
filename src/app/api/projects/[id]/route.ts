import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const project = await prisma.project.findFirst({
    where: { id, userId: auth.userId },
    include: {
      tasks: { orderBy: { updatedAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" }, take: 20 },
      jobApps: { orderBy: { updatedAt: "desc" } },
    },
  });

  if (!project) {
    return jsonError("Proyecto no encontrado", 404);
  }

  return Response.json(project);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.project.findFirst({
    where: { id, userId: auth.userId },
  });
  if (!existing) {
    return jsonError("Proyecto no encontrado", 404);
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      name: body.name?.trim() ?? undefined,
      description: body.description?.trim() ?? undefined,
      type: body.type ?? undefined,
      status: body.status ?? undefined,
    },
  });

  return Response.json(project);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const existing = await prisma.project.findFirst({
    where: { id, userId: auth.userId },
  });
  if (!existing) {
    return jsonError("Proyecto no encontrado", 404);
  }

  await prisma.project.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
