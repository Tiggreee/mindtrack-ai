import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/project-card";
import { CreateProjectForm } from "@/components/create-project-form";

export default async function ProjectsPage() {
  const session = await auth();
  const projects = await prisma.project.findMany({
    where: { userId: session!.user!.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { tasks: true } } },
  });

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Proyectos</h1>
        <p className="text-muted-foreground">
          Organiza tu trabajo por contexto.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <CreateProjectForm />
        <ul className="grid gap-4 sm:grid-cols-2 list-none p-0 m-0">
          {projects.length === 0 ? (
            <li className="text-sm text-muted-foreground col-span-full">
              Aún no hay proyectos.
            </li>
          ) : (
            projects.map((p) => (
              <li key={p.id}>
                <ProjectCard
                  id={p.id}
                  name={p.name}
                  description={p.description}
                  status={p.status}
                  type={p.type}
                  taskCount={p._count.tasks}
                />
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
