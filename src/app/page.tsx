import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">MindTrack</span>
          <Link
            href="/api/auth/signin"
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
          >
            Entrar con Google
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-1 flex-col justify-center px-6 py-16">
        <p className="mb-2 text-sm uppercase tracking-widest text-zinc-500">
          Fase 1
        </p>
        <h1 className="mb-6 max-w-xl text-4xl font-semibold leading-tight">
          Proyectos, tareas y contexto que no se pierde entre sesiones.
        </h1>
        <p className="mb-10 max-w-lg leading-relaxed text-zinc-400">
          Registra avances, bloqueos y próximos pasos. El chat usa lo guardado en
          tu base de datos; las notas se indexan para búsqueda por significado.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm hover:border-zinc-500"
          >
            Ir al panel
          </Link>
        </div>
      </main>
    </div>
  );
}
