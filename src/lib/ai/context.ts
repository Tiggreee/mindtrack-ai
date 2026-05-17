import { prisma } from "@/lib/prisma";

export async function buildProjectContext(
  projectId: string,
  userId: string,
): Promise<string> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      tasks: {
        orderBy: { updatedAt: "desc" },
        take: 20,
      },
      notes: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      jobApps: {
        orderBy: { updatedAt: "desc" },
        take: 10,
      },
    },
  });

  if (!project) {
    return "";
  }

  const lines: string[] = [
    `Proyecto: ${project.name}`,
    project.description ? `Descripción: ${project.description}` : "",
    `Estado: ${project.status}`,
    "",
    "Tareas:",
  ];

  for (const t of project.tasks) {
    lines.push(
      `- [${t.status}] ${t.title}${t.blockedBy ? ` (bloqueo: ${t.blockedBy})` : ""}${t.dueAt ? ` vence ${t.dueAt.toISOString().slice(0, 10)}` : ""}`,
    );
  }

  if (project.notes.length) {
    lines.push("", "Notas recientes:");
    for (const n of project.notes) {
      lines.push(`- ${n.content.slice(0, 300)}`);
    }
  }

  if (project.jobApps.length) {
    lines.push("", "Vacantes (módulo empleo):");
    for (const j of project.jobApps) {
      lines.push(
        `- ${j.company} / ${j.role} [${j.status}]${j.followUpAt ? ` follow-up ${j.followUpAt.toISOString().slice(0, 10)}` : ""}`,
      );
    }
  }

  return lines.filter(Boolean).join("\n");
}
