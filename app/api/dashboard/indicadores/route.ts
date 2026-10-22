import { NextResponse } from "next/server";
import { getSiteSession } from "@/lib/getSiteSession";
import { getUsuarioPainel, pessoasVinculadas } from "@/db/adminQueries";
import {
  limparRealizados,
  listFechamentos,
  listHistorico,
  listResolucoes,
  listValores,
  mesFechado,
  upsertValor,
} from "@/db/indicadoresQueries";
import { mesesValidos, unidadeComVinculos, unidadePorSlug } from "@/lib/indicadores";
import {
  chavesLegiveis,
  ehHead,
  pessoasLegiveis,
  painelLiberado,
  podeAbrirUnidade,
  podeGravar,
  type UsuarioPainel,
} from "@/lib/permissaoIndicadores";

export const dynamic = "force-dynamic";

// Esta rota é a fronteira real da permissão: esconder seção na tela não protege
// nada, porque qualquer pessoa logada pode chamar a API direto. O vínculo
// (unidade e pessoa) é lido do banco a cada chamada, nunca do cookie — assim
// revogar acesso vale na hora, em vez de só quando o cookie expirar.
async function exigeUsuario() {
  const session = await getSiteSession();
  if (!session) return { erro: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };

  const usuario = await getUsuarioPainel(session.uid);
  if (!usuario || !painelLiberado(usuario)) {
    return { erro: NextResponse.json({ error: "Sem acesso ao painel." }, { status: 403 }) };
  }
  return { session, usuario: usuario as UsuarioPainel };
}

const TIPOS = ["real", "meta"] as const;

// A unidade nunca vem do cliente sem passar por aqui: slug fora de UNIDADES é
// recusado, então não há como gravar lançamento numa unidade inventada.
//
// O N5 sai daqui já reduzido a quem está vinculado a um usuário — mesma lista
// que a tela mostra. Fosse o time cadastrado inteiro, a API continuaria
// devolvendo (e aceitando) lançamento de quem não aparece mais no painel.
async function exigeUnidade(slug: string | null | undefined) {
  const bruta = unidadePorSlug(slug?.trim());
  if (!bruta) {
    return { erro: NextResponse.json({ error: "Unidade desconhecida." }, { status: 400 }) };
  }
  return { unidade: unidadeComVinculos(bruta, await pessoasVinculadas(bruta.slug)) };
}

export async function GET(req: Request) {
  const { erro, usuario } = await exigeUsuario();
  if (erro) return erro;

  const { erro: erroUnidade, unidade } = await exigeUnidade(new URL(req.url).searchParams.get("unidade"));
  if (erroUnidade) return erroUnidade;

  if (!podeAbrirUnidade(usuario, unidade.slug)) {
    return NextResponse.json({ error: "Sem acesso a esta unidade." }, { status: 403 });
  }

  const [valores, fechamentos, historico, resolucoes] = await Promise.all([
    listValores(unidade.slug),
    listFechamentos(unidade.slug),
    listHistorico(unidade.slug),
    listResolucoes(unidade.slug),
  ]);

  // A resolução é texto sobre a dificuldade de uma pessoa — filtra pela mesma
  // regra do RMR, que é o documento mais próximo disto.
  const pessoas = pessoasLegiveis(usuario, unidade);

  const permitidas = chavesLegiveis(usuario, unidade);
  // Filtrar aqui, e não na tela: o colaborador não pode nem receber o número do
  // colega ou do N3 na resposta. Vale também pro histórico, que repete valores.
  return NextResponse.json({
    valores: permitidas ? valores.filter((v) => permitidas.has(v.chave)) : valores,
    fechamentos,
    historico: permitidas ? historico.filter((h) => permitidas.has(h.chave)) : historico,
    resolucoes: pessoas ? resolucoes.filter((r) => pessoas.includes(r.pessoa)) : resolucoes,
  });
}

export async function POST(req: Request) {
  const { erro, session, usuario } = await exigeUsuario();
  if (erro) return erro;

  const body = (await req.json().catch(() => null)) as {
    unidade?: string;
    mes?: string;
    tipo?: string;
    chave?: string;
    valor?: number | string | null;
  } | null;

  const { erro: erroUnidade, unidade } = await exigeUnidade(body?.unidade);
  if (erroUnidade) return erroUnidade;

  const mes = body?.mes?.trim();
  const tipo = body?.tipo?.trim();
  const chave = body?.chave?.trim();

  if (!mes || !mesesValidos().includes(mes)) {
    return NextResponse.json({ error: "Mês fora dos ciclos do painel." }, { status: 400 });
  }
  if (!tipo || !TIPOS.includes(tipo as (typeof TIPOS)[number])) {
    return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
  }
  if (!chave) {
    return NextResponse.json({ error: "Chave do indicador é obrigatória." }, { status: 400 });
  }

  if (!podeGravar(usuario, { unidade, tipo: tipo as "real" | "meta", chave })) {
    return NextResponse.json(
      { error: "Você só pode lançar o próprio realizado, na sua unidade." },
      { status: 403 }
    );
  }

  // Mês fechado trava para todo mundo, Head incluído: o sentido do fechamento é
  // o número parar de mudar depois de divulgado. Quem quiser corrigir reabre o
  // mês antes — e esse reabrir fica registrado.
  if (await mesFechado(unidade.slug, mes)) {
    return NextResponse.json(
      { error: "Mês fechado. Reabra o mês antes de lançar.", mesFechado: true },
      { status: 409 }
    );
  }

  const bruto = body?.valor;
  let valor: number | null = null;
  if (bruto !== null && bruto !== undefined && bruto !== "") {
    const n = typeof bruto === "number" ? bruto : parseFloat(String(bruto));
    if (Number.isNaN(n) || !Number.isFinite(n)) {
      return NextResponse.json({ error: "Valor inválido." }, { status: 400 });
    }
    valor = n;
  }

  await upsertValor({
    unidade: unidade.slug,
    mes,
    tipo: tipo as "real" | "meta",
    chave,
    valor,
    updatedBy: session?.uid ?? null,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { erro, session, usuario } = await exigeUsuario();
  if (erro) return erro;

  // Apagar os realizados do mês inteiro é ação de Head — um colaborador nunca
  // limpa lançamento, nem o próprio.
  if (!ehHead(usuario)) {
    return NextResponse.json({ error: "Acesso restrito ao Head." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const { erro: erroUnidade, unidade } = await exigeUnidade(searchParams.get("unidade"));
  if (erroUnidade) return erroUnidade;

  const mes = searchParams.get("mes");
  if (!mes || !mesesValidos().includes(mes)) {
    return NextResponse.json({ error: "Mês fora dos ciclos do painel." }, { status: 400 });
  }

  if (await mesFechado(unidade.slug, mes)) {
    return NextResponse.json(
      { error: "Mês fechado. Reabra o mês antes de limpar.", mesFechado: true },
      { status: 409 }
    );
  }

  await limparRealizados(unidade.slug, mes, session?.uid ?? null);
  return NextResponse.json({ ok: true });
}
