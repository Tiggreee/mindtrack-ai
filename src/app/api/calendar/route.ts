import { jsonError } from "@/lib/api";

export async function GET() {
  return jsonError("Google Calendar disponible en Fase 3", 501);
}

export async function POST() {
  return jsonError("Google Calendar disponible en Fase 3", 501);
}
