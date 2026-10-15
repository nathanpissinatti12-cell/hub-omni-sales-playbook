import { NextResponse } from "next/server";
import { getUserById, logAdminAction, updateUserAccess, type AccessLevel, type BdrLevel } from "@/db/adminQueries";
import { unidadePorSlug } from "@/lib/indicadores";

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
    unidade?: string | null;
    pessoaChave?: string | null;
  } | null;

  const accessLevel = (body?.accessLevel as AccessLevel | undefined) ?? existing.access_level;
  const bdrLevel = (body?.bdrLevel as BdrLevel | undefined) ?? existing.bdr_level;
  const active = body?.active ?? existing.active;
  const unidade = body?.unidade === undefined ? existing.unidade : body.unidade || null;
  const pessoaChave = body?.pessoaChave === undefined ? existing.pessoa_chave : body.pessoaChave || null;

  if (!ACCESS_LEVELS.includes(accessLevel)) {
    return NextResponse.json({ error: "Nível de acesso inválido." }, { status: 400 });
  }
  if (accessLevel === "bdr" && (!bdrLevel || !BDR_LEVELS.includes(bdrLevel))) {
    return NextResponse.json({ error: "Nível BDR inválido." }, { status: 400 });
  }

  // O par unidade+pessoa precisa existir de verdade: vínculo quebrado abriria o
  // painel do colaborador vazio, sem explicar o motivo.
  if (accessLevel !== "root" && (unidade || pessoaChave)) {
    const alvo = unidadePorSlug(unidade ?? "");
    if (!alvo) {
      return NextResponse.json({ error: "Unidade inválida." }, { status: 400 });
    }
    if (!pessoaChave || !alvo.pessoas.some((p) => p.chave === pessoaChave)) {
      return NextResponse.json({ error: `Pessoa não encontrada no time de ${alvo.nome}.` }, { status: 400 });
    }
  }

  const updated = await updateUserAccess(params.id, {
    accessLevel,
    bdrLevel: accessLevel === "bdr" ? (bdrLevel as BdrLevel) : null,
    active,
    unidade,
    pessoaChave,
  });

  await logAdminAction({
    action: active === existing.active ? "permissao_alterada" : active ? "usuario_reativado" : "usuario_desativado",
    targetUserId: existing.id,
    targetUserName: existing.name,
    details:
      `Nível: ${accessLevel}${accessLevel === "bdr" ? ` (${bdrLevel})` : ""} · Ativo: ${active ? "sim" : "não"}` +
      (accessLevel !== "root" && unidade ? ` · Painel: ${unidade}/${pessoaChave}` : ""),
  });

  return NextResponse.json(updated);
}
