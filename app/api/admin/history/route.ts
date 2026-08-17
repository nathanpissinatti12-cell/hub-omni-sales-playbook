import { NextResponse } from "next/server";
import { clearHistory, listHistory } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

export async function GET() {
  const history = await listHistory();
  return NextResponse.json(history);
}

export async function DELETE() {
  await clearHistory();
  return NextResponse.json({ ok: true });
}
