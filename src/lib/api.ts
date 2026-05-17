import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  }
  return { userId: session.user.id };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
