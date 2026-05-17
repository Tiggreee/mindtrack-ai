"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProjectOption = { id: string; name: string };

export function CreateTaskForm({
  projects,
  defaultProjectId,
}: {
  projects: ProjectOption[];
  defaultProjectId?: string;
}) {
  const router = useRouter();
  const [projectId, setProjectId] = useState(
    defaultProjectId ?? projects[0]?.id ?? "",
  );
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, title }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al crear");
      }
      setTitle("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (!projects.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Crea un proyecto antes de añadir tareas.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-border p-4">
      <h2 className="text-sm font-medium">Nueva tarea</h2>
      <select
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <Input
        placeholder="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={loading || !title.trim()}>
        {loading ? "Guardando…" : "Añadir"}
      </Button>
    </form>
  );
}
