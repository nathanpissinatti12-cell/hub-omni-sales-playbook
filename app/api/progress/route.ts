import { NextResponse } from "next/server";
import { getSiteSession } from "@/lib/getSiteSession";
import { getUserProgress, recordProgress } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSiteSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const progress = await getUserProgress(session.uid);
  return NextResponse.json(progress);
}

export async function POST(req: Request) {
  const session = await getSiteSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { moduleId?: number; sectionId?: string } | null;
  const moduleId = body?.moduleId;
  const sectionId = body?.sectionId;

  if (!moduleId || !sectionId) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  await recordProgress(session.uid, moduleId, sectionId);
  return NextResponse.json({ ok: true });
}
