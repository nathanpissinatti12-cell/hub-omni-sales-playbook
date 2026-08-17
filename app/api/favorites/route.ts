import { NextResponse } from "next/server";
import { getSiteSession } from "@/lib/getSiteSession";
import { getUserFavorites, toggleFavorite } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSiteSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const favorites = await getUserFavorites(session.uid);
  return NextResponse.json(favorites);
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

  const favorited = await toggleFavorite(session.uid, moduleId, sectionId);
  return NextResponse.json({ favorited });
}
