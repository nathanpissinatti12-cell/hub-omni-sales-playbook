import { NextResponse } from "next/server";
import { createSuggestion } from "@/db/adminQueries";
import { getSiteSession } from "@/lib/getSiteSession";

export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    message?: string;
  } | null;

  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Mensagem é obrigatória." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Mensagem muito longa." }, { status: 400 });
  }

  const session = await getSiteSession();

  const suggestion = await createSuggestion({
    name: body?.name?.trim() || null,
    email: body?.email?.trim() || null,
    message,
    userId: session?.uid ?? null,
  });

  return NextResponse.json({ ok: true, id: suggestion.id }, { status: 201 });
}
