import { NextResponse } from "next/server";
import { deleteHistoryEntry } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const deleted = await deleteHistoryEntry(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Registro não encontrado." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
