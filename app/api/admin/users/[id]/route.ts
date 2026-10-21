import { NextResponse } from "next/server";
import { NIVEIS_SISTEMA } from "@/lib/acessoSistema";
import { getUserById, logAdminAction, updateUserAccess, type AccessLevel, type BdrLevel } from "@/db/adminQueries";
import { unidadePorSlug } from "@/lib/indicadores";
import { NIVEIS_PAINEL, type NivelPainel } from "@/lib/permissaoIndicadores";

export const dynamic = "force-dynamic";

const ACCESS_LEVELS: readonly AccessLevel[] = NIVEIS_SISTEMA;
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
    nivelPainel?: string | null;
  } | null;

  const accessLevel = (body?.accessLevel as AccessLevel | undefined) ?? existing.access_level;
  const bdrLevel = (body?.bdrLevel as BdrLevel | undefined) ?? existing.bdr_level;
  const active = body?.active ?? existing.active;
  const unidade = body?.unidade === undefined ? existing.unidade : body.unidade || null;
  const pessoaChave = body?.pessoaChave === undefined ? existing.pessoa_chave : body.pessoaChave || null;
  const nivelPainel = (body?.nivelPainel === undefined ? existing.nivel_painel : body.nivelPainel || null) as
    | NivelPainel
    | null;

  if (!ACCESS_LEVELS.includes(accessLevel)) {
    return NextResponse.json({ error: "Nível de acesso inválido." }, { status: 400 });
  }
  if (accessLevel === "bdr" && (!bdrLevel || !BDR_LEVELS.includes(bdrLevel))) {
    return NextResponse.json({ error: "Nível BDR inválido." }, { status: 400 });
  }

  if (nivelPainel !== null && !NIVEIS_PAINEL.some((n) => n.valor === nivelPainel)) {
    return NextResponse.json({ error: "Nível do painel inválido." }, { status: 400 });
  }

  // O vínculo é validado pelo NÍVEL DO PAINEL, não pelo nível de acesso: desde
  // que os dois eixos se separaram, um root pode ter nível n5 (vê só a própria
  // linha) e um bdr pode ter n4. Vínculo quebrado abriria o painel vazio, sem
  // explicar o motivo.
  if (nivelPainel !== null) {
    const alvo = unidadePorSlug(unidade ?? "");
    if (!alvo) {
      return NextResponse.json(
        { error: "Escolha a unidade do painel para este nível." },
        { status: 400 }
      );
    }
    // Só o n5 precisa de pessoa: n3 e n4 olham o time inteiro.
    if (nivelPainel === "n5" && (!pessoaChave || !alvo.pessoas.some((p) => p.chave === pessoaChave))) {
      return NextResponse.json(
        { error: `Escolha a pessoa do N5 no time de ${alvo.nome}.` },
        { status: 400 }
      );
    }
  }

  const updated = await updateUserAccess(params.id, {
    accessLevel,
    bdrLevel: accessLevel === "bdr" ? (bdrLevel as BdrLevel) : null,
    active,
    unidade,
    pessoaChave,
    nivelPainel,
  });

  await logAdminAction({
    action: active === existing.active ? "permissao_alterada" : active ? "usuario_reativado" : "usuario_desativado",
    targetUserId: existing.id,
    targetUserName: existing.name,
    details:
      `Nível: ${accessLevel}${accessLevel === "bdr" ? ` (${bdrLevel})` : ""} · Ativo: ${active ? "sim" : "não"}` +
      (unidade ? ` · Painel: ${unidade}${pessoaChave ? `/${pessoaChave}` : ""}` : ""),
  });

  return NextResponse.json(updated);
}
