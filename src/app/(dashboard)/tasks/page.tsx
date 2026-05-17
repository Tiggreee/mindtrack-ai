import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { CreateTaskForm } from "@/components/create-task-form";

type Props = { searchParams: Promise<{ project?: string }> };

export default async function TasksPage({ searchParams }: Props) {
  const { project: projectFilter } = await searchParams;
  const session = await auth();
  const userId = session!.user!.id;

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const tasks = await prisma.task.findMany({
    where: {
      project: { userId },
      ...(projectFilter ? { projectId: projectFilter } : {}),
    },
    orderBy: [{ status: "asc" }, { dueAt: "asc" }],
    include: { project: { select: { name: true } } },
  });

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Tareas</h1>
        <p className="text-muted-foreground">
          {projectFilter
            ? "Filtradas por proyecto seleccionado."
            : "Todas tus tareas abiertas y cerradas."}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <CreateTaskForm
          projects={projects}
          defaultProjectId={projectFilter}
        />
        <ul className="space-y-2 list-none p-0 m-0">
          {tasks.length === 0 ? (
            <li className="text-sm text-muted-foreground">Sin tareas.</li>
          ) : (
            tasks.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-4 py-3"
              >
                <span>
                  <span className="font-medium">{t.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {t.project.name}
                  </span>
                </span>
                <Badge variant="outline">{t.status}</Badge>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
