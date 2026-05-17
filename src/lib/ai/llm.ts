type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function completeChat(
  messages: ChatMessage[],
  systemContext?: string,
): Promise<string> {
  const provider = process.env.LLM_PROVIDER ?? "anthropic";

  if (provider === "groq") {
    return callOpenAICompatible(
      "https://api.groq.com/openai/v1/chat/completions",
      process.env.GROQ_API_KEY,
      "llama-3.3-70b-versatile",
      messages,
      systemContext,
    );
  }

  return callAnthropic(messages, systemContext);
}

async function callAnthropic(
  messages: ChatMessage[],
  systemContext?: string,
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY no configurada");
  }

  const system = [
    systemContext,
    "Responde en el idioma del usuario. Sé breve y accionable.",
  ]
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
): Promise<string> {
  if (!apiKey) {
    throw new Error("GROQ_API_KEY no configurada");
  }

  const payload = [
    ...(systemContext
      ? [{ role: "system" as const, content: systemContext }]
      : []),
    ...messages,
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages: payload }),
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
