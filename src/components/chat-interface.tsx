"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { getMessageText } from "@/lib/ai/message-text";
import type { UIMessage } from "ai";

type ProjectOption = { id: string; name: string };

export function ChatInterface({ projects }: { projects: ProjectOption[] }) {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { projectId: projectId || undefined },
      }),
    [projectId],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const busy = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    sendMessage({ text });
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-muted-foreground" htmlFor="chat-project">
          Proyecto
        </label>
        <select
          id="chat-project"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        >
          <option value="">Sin proyecto</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Pregunta qué sigue, qué está bloqueado o pide un resumen del
              proyecto.
            </p>
          ) : (
            messages.map((m: UIMessage) => (
              <div
                key={m.id}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm"
                }
              >
                {getMessageText(m)}
              </div>
            ))
          )}
        </div>

        {error ? (
          <p className="border-t border-border px-4 py-2 text-sm text-destructive">
            {error.message}
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-border p-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje…"
            rows={2}
            className="min-h-0 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={busy || !input.trim()}>
            Enviar
          </Button>
        </form>
      </Card>
    </div>
  );
}
