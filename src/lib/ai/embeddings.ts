const OPENAI_MODEL = "text-embedding-3-small";
const OPENAI_DIMENSIONS = 1536;
const OLLAMA_DIMENSIONS = 768;

export function embeddingDimensions(): number {
  return process.env.EMBEDDING_PROVIDER === "openai"
    ? OPENAI_DIMENSIONS
    : OLLAMA_DIMENSIONS;
}

export const EMBEDDING_DIMENSIONS = OLLAMA_DIMENSIONS;

export async function embedText(text: string): Promise<number[]> {
  if (process.env.EMBEDDING_PROVIDER === "openai") {
    return embedOpenAI(text);
  }
  return embedOllama(text);
}

async function embedOllama(text: string): Promise<number[]> {
  const base = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";

  const res = await fetch(`${base}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt: text.slice(0, 8000) }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama embeddings: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { embedding: number[] };
  return data.embedding ?? [];
}

async function embedOpenAI(text: string): Promise<number[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY no configurada");
  }

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: text.slice(0, 8000),
      dimensions: OPENAI_DIMENSIONS,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI embeddings: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    data: { embedding: number[] }[];
  };
  return data.data[0]?.embedding ?? [];
}
