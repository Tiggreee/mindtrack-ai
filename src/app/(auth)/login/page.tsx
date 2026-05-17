import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-sm space-y-6 text-center">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">MindTrack</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de proyectos con memoria y contexto persistente.
          </p>
        </header>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <Button type="submit" className="w-full">
            Continuar con Google
          </Button>
        </form>
      </section>
    </main>
  );
}
