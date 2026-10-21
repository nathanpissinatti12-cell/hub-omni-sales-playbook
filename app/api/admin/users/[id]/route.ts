import { NextResponse } from "next/server";
import { NIVEIS_SISTEMA } from "@/lib/acessoSistema";
import {
  contarAdministradoresAtivos,
  deleteUser,
  getUserById,
  logAdminAction,
  updateUserAccess,
  type AccessLevel,
  type BdrLevel,
} from "@/db/adminQueries";
import { ehAdministrador } from "@/lib/acessoSistema";
import { getSiteSession } from "@/lib/getSiteSession";
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

  // Mesma trava do DELETE: a última conta de administrador ativa não pode
  // perder o nível nem ser desativada, senão ninguém reabre o /admin.
  const deixaDeSerAdmin = ehAdministrador(existing.access_level) && existing.active
    && (!active || !ehAdministrador(accessLevel));
  if (deixaDeSerAdmin && (await contarAdministradoresAtivos()) <= 1) {
    return NextResponse.json(
      { error: "Este é o último administrador ativo — sem ele ninguém reabre o /admin." },
      { status: 400 }
    );
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

/**
 * Exclusão definitiva. O caminho normal continua sendo DESATIVAR: o usuário
 * some do login e o que ele fez continua registrado. Excluir é para quem foi
 * criado errado ou nunca deveria ter entrado.
 *
 * Duas recusas, e as duas existem para não trancar ninguém do lado de fora:
 * ninguém exclui a si mesmo, e o último administrador ativo não pode ser
 * excluído — sem ele não há quem reabra o /admin.
 */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const existing = await getUserById(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const session = await getSiteSession();
  if (session?.uid === params.id) {
    return NextResponse.json(
      { error: "Você não pode excluir o próprio usuário." },
      { status: 400 }
    );
  }

  if (ehAdministrador(existing.access_level) && existing.active) {
    const administradores = await contarAdministradoresAtivos();
    if (administradores <= 1) {
      return NextResponse.json(
        { error: "Este é o último administrador ativo — excluí-lo trancaria o /admin." },
        { status: 400 }
      );
    }
  }

  const removido = await deleteUser(params.id);
  if (!removido) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  // targetUserId fica nulo de propósito: a linha do histórico sobrevive à
  // exclusão (a FK é ON DELETE SET NULL) e o nome preserva de quem se tratava.
  await logAdminAction({
    action: "usuario_excluido",
    targetUserId: null,
    targetUserName: removido.name,
    details: `${removido.email} · Nível: ${removido.access_level} · Exclusão definitiva`,
  });

  return NextResponse.json({ ok: true });
}
