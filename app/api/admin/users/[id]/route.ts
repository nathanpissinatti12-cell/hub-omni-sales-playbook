import { NextResponse } from "next/server";
import { getUserById, logAdminAction, updateUserAccess, type AccessLevel, type BdrLevel } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

const ACCESS_LEVELS: AccessLevel[] = ["bdr", "closer", "root"];
const BDR_LEVELS: BdrLevel[] = ["blue", "gold", "black", "platinum"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const existing = await getUserById(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as {
    accessLevel?: string;
    bdrLevel?: string | null;
    active?: boolean;
  } | null;

  const accessLevel = (body?.accessLevel as AccessLevel | undefined) ?? existing.access_level;
  const bdrLevel = (body?.bdrLevel as BdrLevel | undefined) ?? existing.bdr_level;
  const active = body?.active ?? existing.active;

  if (!ACCESS_LEVELS.includes(accessLevel)) {
    return NextResponse.json({ error: "Nível de acesso inválido." }, { status: 400 });
  }
  if (accessLevel === "bdr" && (!bdrLevel || !BDR_LEVELS.includes(bdrLevel))) {
    return NextResponse.json({ error: "Nível BDR inválido." }, { status: 400 });
  }

  const updated = await updateUserAccess(params.id, {
    accessLevel,
    bdrLevel: accessLevel === "bdr" ? (bdrLevel as BdrLevel) : null,
    active,
  });

  await logAdminAction({
    action: active === existing.active ? "permissao_alterada" : active ? "usuario_reativado" : "usuario_desativado",
    targetUserId: existing.id,
    targetUserName: existing.name,
    details: `Nível: ${accessLevel}${accessLevel === "bdr" ? ` (${bdrLevel})` : ""} · Ativo: ${active ? "sim" : "não"}`,
  });

  return NextResponse.json(updated);
}
