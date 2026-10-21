import { NextResponse } from "next/server";
import { NIVEIS_SISTEMA } from "@/lib/acessoSistema";
import { unidadePorSlug } from "@/lib/indicadores";
import { NIVEIS_PAINEL, type NivelPainel } from "@/lib/permissaoIndicadores";
import { createUser, listUsers, logAdminAction, type AccessLevel, type BdrLevel } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

const ACCESS_LEVELS: readonly AccessLevel[] = NIVEIS_SISTEMA;
const BDR_LEVELS: BdrLevel[] = ["blue", "gold", "black", "platinum"];

export async function GET() {
  const users = await listUsers();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
    accessLevel?: string;
    bdrLevel?: string;
    unidade?: string | null;
    pessoaChave?: string | null;
    nivelPainel?: string | null;
  } | null;

  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";
  const accessLevel = body?.accessLevel as AccessLevel | undefined;
  const bdrLevel = body?.bdrLevel as BdrLevel | undefined;
  const unidade = body?.unidade || null;
  const pessoaChave = body?.pessoaChave || null;
  const nivelPainel = (body?.nivelPainel || null) as NivelPainel | null;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nome, e-mail e senha são obrigatórios." }, { status: 400 });
  }
  if (!accessLevel || !ACCESS_LEVELS.includes(accessLevel)) {
    return NextResponse.json({ error: "Nível de acesso inválido." }, { status: 400 });
  }
  if (accessLevel === "bdr" && (!bdrLevel || !BDR_LEVELS.includes(bdrLevel))) {
    return NextResponse.json({ error: "Nível BDR inválido." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres." }, { status: 400 });
  }

  // Mesmas regras da edição (PATCH), de propósito: criar com vínculo quebrado
  // abriria o painel vazio, sem explicar o motivo.
  if (nivelPainel !== null && !NIVEIS_PAINEL.some((n) => n.valor === nivelPainel)) {
    return NextResponse.json({ error: "Nível do painel inválido." }, { status: 400 });
  }
  if (nivelPainel !== null) {
    const alvo = unidadePorSlug(unidade ?? "");
    if (!alvo) {
      return NextResponse.json(
        { error: "Escolha a unidade do painel para este nível." },
        { status: 400 }
      );
    }
    if (nivelPainel === "n5" && (!pessoaChave || !alvo.pessoas.some((p) => p.chave === pessoaChave))) {
      return NextResponse.json(
        { error: `Escolha a pessoa do N5 no time de ${alvo.nome}.` },
        { status: 400 }
      );
    }
  }

  try {
    const user = await createUser({
      name,
      email,
      password,
      accessLevel,
      bdrLevel: accessLevel === "bdr" ? bdrLevel! : null,
      unidade,
      pessoaChave,
      nivelPainel,
    });
    await logAdminAction({
      action: "usuario_criado",
      targetUserId: user.id,
      targetUserName: user.name,
      details:
        `Nível: ${accessLevel}${accessLevel === "bdr" ? ` (${bdrLevel})` : ""}` +
        (nivelPainel
          ? ` · Painel: ${unidade}/${nivelPainel}${pessoaChave ? `/${pessoaChave}` : ""}`
          : " · Painel: sem acesso"),
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("admin_users_email_key")) {
      return NextResponse.json({ error: "Já existe um usuário com esse e-mail." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro ao criar usuário." }, { status: 500 });
  }
}
