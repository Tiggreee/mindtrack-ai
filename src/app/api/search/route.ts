import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError } from "@/lib/api";
import { embedText } from "@/lib/ai/embeddings";

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { query, projectId, limit = 8 } = body as {
    query?: string;
    projectId?: string;
    limit?: number;
  };

  if (!query?.trim()) {
    return jsonError("query es obligatorio");
  }

  let vector: number[];
  try {
    vector = await embedText(query.trim());
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error de embeddings";
    return jsonError(msg, 503);
  }

  const vectorLiteral = `[${vector.join(",")}]`;

  const rows = await prisma.$queryRawUnsafe<
    { id: string; content: string; score: number; projectId: string | null }[]
  >(
    `
    SELECT n.id, n.content, n."projectId",
           1 - (e.vector <=> $1::vector) AS score
    FROM "Note" n
    JOIN "Embedding" e ON e."noteId" = n.id
    WHERE n."userId" = $2
      AND ($3::text IS NULL OR n."projectId" = $3)
    ORDER BY e.vector <=> $1::vector
    LIMIT $4
    `,
    vectorLiteral,
    auth.userId,
    projectId ?? null,
    limit,
  );

  return Response.json({ results: rows });
}
