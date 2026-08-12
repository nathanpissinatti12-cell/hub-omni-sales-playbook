import { NextResponse } from "next/server";
import { updateSuggestionStatus } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

const STATUSES = ["nova", "lida", "arquivada"] as const;

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json().catch(() => null)) as { status?: string } | null;
  const status = body?.status as (typeof STATUSES)[number] | undefined;

  if (!status || !STATUSES.includes(status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  const updated = await updateSuggestionStatus(params.id, status);
  if (!updated) {
    return NextResponse.json({ error: "Sugestão não encontrada." }, { status: 404 });
  }
  return NextResponse.json(updated);
}
