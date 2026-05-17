import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChatInterface } from "@/components/chat-interface";

export default async function ChatPage() {
  const session = await auth();
  const projects = await prisma.project.findMany({
    where: { userId: session!.user!.id, status: "active" },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Chat</h1>
        <p className="text-muted-foreground">
          Habla con contexto del proyecto. Requiere Ollama en local o Groq
          configurado.
        </p>
      </header>
      <ChatInterface projects={projects} />
    </section>
  );
}
