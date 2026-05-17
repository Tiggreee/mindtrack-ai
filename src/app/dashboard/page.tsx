import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            MindTrack
          </Link>
          <span className="text-sm text-zinc-400">{session.user.email}</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="mb-2 text-2xl font-semibold">Panel</h1>
        <p className="mb-8 text-zinc-400">
          APIs listas: proyectos, tareas, chat y búsqueda. Configura{" "}
          <code className="text-zinc-300">.env.local</code> y ejecuta{" "}
          <code className="text-zinc-300">npx prisma db push</code>.
        </p>

        <section className="grid gap-4 sm:grid-cols-2">
          <ApiCard
            title="Proyectos"
            endpoints={["GET /api/projects", "POST /api/projects"]}
          />
          <ApiCard
            title="Tareas"
            endpoints={["GET /api/tasks?projectId=", "POST /api/tasks"]}
          />
          <ApiCard title="Chat" endpoints={["POST /api/chat"]} />
          <ApiCard title="Búsqueda" endpoints={["POST /api/search"]} />
        </section>
      </main>
    </div>
  );
}

function ApiCard({
  title,
  endpoints,
}: {
  title: string;
  endpoints: string[];
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
      <h2 className="mb-3 font-medium">{title}</h2>
      <ul className="space-y-1 font-mono text-xs text-zinc-500">
        {endpoints.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  );
}
