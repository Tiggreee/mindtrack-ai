import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardHomePage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [projectCount, taskCount, dueSoon] = await Promise.all([
    prisma.project.count({ where: { userId, status: "active" } }),
    prisma.task.count({
      where: { project: { userId }, status: { not: "done" } },
    }),
    prisma.task.count({
      where: {
        project: { userId },
        status: { not: "done" },
        dueAt: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Inicio</h1>
        <p className="text-muted-foreground">
          Resumen de tus proyectos activos.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-3 list-none p-0 m-0">
        <li>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Proyectos activos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {projectCount}
            </CardContent>
          </Card>
        </li>
        <li>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tareas abiertas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{taskCount}</CardContent>
          </Card>
        </li>
        <li>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vencen en 7 días
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{dueSoon}</CardContent>
          </Card>
        </li>
      </ul>

      <p className="flex flex-wrap gap-3">
        <Link href="/projects">
          <Button>Ver proyectos</Button>
        </Link>
        <Link href="/chat">
          <Button variant="outline">Abrir chat</Button>
        </Link>
      </p>
    </section>
  );
}
