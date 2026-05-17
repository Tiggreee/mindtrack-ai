type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function completeChat(
  messages: ChatMessage[],
  systemContext?: string,
): Promise<string> {
  const provider = process.env.LLM_PROVIDER ?? "ollama";

  if (provider === "groq") {
    return callOpenAICompatible(
      "https://api.groq.com/openai/v1/chat/completions",
      process.env.GROQ_API_KEY,
      "llama-3.3-70b-versatile",
      messages,
      systemContext,
      true,
    );
  }

  if (provider === "anthropic") {
    return callAnthropic(messages, systemContext);
  }

  const base = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.2";
  return callOpenAICompatible(
    `${base}/v1/chat/completions`,
    "ollama",
    model,
    messages,
    systemContext,
    false,
  );
}

async function callAnthropic(
  messages: ChatMessage[],
  systemContext?: string,
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY no configurada");
  }

  const system = [systemContext, "Responde en el idioma del usuario. Sé breve."]
    .filter(Boolean)
    .join("\n\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    content: { type: string; text: string }[];
  };
  return data.content[0]?.text ?? "";
}

async function callOpenAICompatible(
  url: string,
  apiKey: string | undefined,
  model: string,
  messages: ChatMessage[],
  systemContext?: string,
  requireBearer = true,
): Promise<string> {
  if (requireBearer && !apiKey) {
    throw new Error("API key no configurada");
  }

  const payload = [
    ...(systemContext
      ? [{ role: "system" as const, content: systemContext }]
      : []),
    ...messages,
  ];

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (requireBearer && apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages: payload, stream: false }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "";
}
