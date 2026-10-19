import { NextResponse } from "next/server";
import { getUsuarioPainel } from "@/db/adminQueries";
import { getRmr, listRmr, upsertRmr } from "@/db/rmrQueries";
import { getSiteSession } from "@/lib/getSiteSession";
import { mesesValidos, unidadePorSlug } from "@/lib/indicadores";
import { painelLiberado, permissaoDe, podeAbrirUnidade, type UsuarioPainel } from "@/lib/permissaoIndicadores";
import { normalizarRmr } from "@/lib/rmr";

export const dynamic = "force-dynamic";

// Mesma fronteira da rota de lançamentos: esconder seção na tela não protege
// nada, porque qualquer pessoa logada chama a API direto. Aqui o conteúdo é mais
// sensível que número — tem diagnóstico de capacidade e pedido de suporte — e o
// vínculo é lido do banco a cada chamada, nunca do cookie.
async function exigeUsuario() {
  const session = await getSiteSession();
  if (!session) return { erro: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };

  const usuario = await getUsuarioPainel(session.uid);
  if (!usuario || !painelLiberado(usuario)) {
    return { erro: NextResponse.json({ error: "Sem acesso ao painel." }, { status: 403 }) };
  }
  return { session, usuario: usuario as UsuarioPainel };
}

function exigeUnidade(slug: string | null | undefined) {
  const unidade = unidadePorSlug(slug?.trim());
  if (!unidade) {
    return { erro: NextResponse.json({ error: "Unidade desconhecida." }, { status: 400 }) };
  }
  return { unidade };
}

/**
 * Quais pessoas este usuário pode ler. null = todas (Head). A lista sai da
 * permissão e nunca do cliente: é o que impede pedir o diagnóstico do colega
 * trocando um parâmetro na URL.
 */
function pessoasLegiveis(usuario: UsuarioPainel): string[] | null {
  const permissao = permissaoDe(usuario);
  if (permissao.somentePessoa === null) return null;
  return [permissao.somentePessoa];
}

export async function GET(req: Request) {
  const { erro, usuario } = await exigeUsuario();
  if (erro) return erro;

  const params = new URL(req.url).searchParams;
  const { erro: erroUnidade, unidade } = exigeUnidade(params.get("unidade"));
  if (erroUnidade) return erroUnidade;

  if (!podeAbrirUnidade(usuario, unidade.slug)) {
    return NextResponse.json({ error: "Sem acesso a esta unidade." }, { status: 403 });
  }

  const relatorios = await listRmr(unidade.slug, pessoasLegiveis(usuario));
  return NextResponse.json({
    relatorios: relatorios.map((r) => ({ ...r, conteudo: normalizarRmr(r.conteudo) })),
  });
}

export async function POST(req: Request) {
  const { erro, session, usuario } = await exigeUsuario();
  if (erro) return erro;

  const corpo = (await req.json().catch(() => null)) as {
    unidade?: string;
    mes?: string;
    pessoa?: string;
    conteudo?: unknown;
  } | null;
  if (!corpo) return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });

  const { erro: erroUnidade, unidade } = exigeUnidade(corpo.unidade);
  if (erroUnidade) return erroUnidade;

  // Mês fora do ciclo não grava: senão dá para criar relatório de mês que não
  // existe no painel, que depois nenhuma tela mostra.
  const mes = (corpo.mes ?? "").trim();
  if (!mesesValidos().includes(mes)) {
    return NextResponse.json({ error: "Mês fora dos ciclos conhecidos." }, { status: 400 });
  }

  // A pessoa precisa existir NESTA unidade. Sem isso, um erro de digitação cria
  // uma linha órfã que não aparece em lugar nenhum.
  const pessoa = (corpo.pessoa ?? "").trim();
  if (!unidade.pessoas.some((p) => p.chave === pessoa)) {
    return NextResponse.json({ error: "Pessoa não encontrada nesta unidade." }, { status: 400 });
  }

  const permitidas = pessoasLegiveis(usuario);
  const podeEscrever =
    podeAbrirUnidade(usuario, unidade.slug) && (permitidas === null || permitidas.includes(pessoa));
  if (!podeEscrever) {
    return NextResponse.json({ error: "Sem permissão para este relatório." }, { status: 403 });
  }

  // Normaliza antes de gravar: o que entra no banco tem o formato que a tela
  // espera, independentemente do que o cliente mandou.
  await upsertRmr(unidade.slug, mes, pessoa, normalizarRmr(corpo.conteudo), session?.uid ?? null);

  const salvo = await getRmr(unidade.slug, mes, pessoa);
  return NextResponse.json({
    ok: true,
    atualizadoEm: salvo?.atualizadoEm ?? null,
    atualizadoPor: salvo?.atualizadoPor ?? null,
  });
}
