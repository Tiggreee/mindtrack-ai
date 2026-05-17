import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError } from "@/lib/api";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const projects = await prisma.project.findMany({
    where: { userId: auth.userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { tasks: true, jobApps: true } },
    },
  });

  return Response.json(projects);
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { name, description, type, status } = body as {
    name?: string;
    description?: string;
    type?: "general" | "job_hunt";
    status?: "active" | "paused" | "done" | "archived";
  };

  if (!name?.trim()) {
    return jsonError("name es obligatorio");
  }

  const project = await prisma.project.create({
    data: {
      userId: auth.userId,
      name: name.trim(),
      description: description?.trim() || null,
      type: type ?? "general",
      status: status ?? "active",
    },
  });

  return Response.json(project, { status: 201 });
}
