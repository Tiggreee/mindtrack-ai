import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export function getChatModel(): LanguageModel {
  const provider = process.env.LLM_PROVIDER ?? "ollama";

  if (provider === "groq") {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY ?? "",
    });
    return groq("llama-3.3-70b-versatile");
  }

  const base = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const ollama = createOpenAI({
    baseURL: `${base}/v1`,
    apiKey: "ollama",
  });
  return ollama(process.env.OLLAMA_MODEL ?? "llama3.2");
}
