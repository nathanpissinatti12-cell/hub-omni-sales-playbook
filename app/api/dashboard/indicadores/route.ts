import { NextResponse } from "next/server";
import { getSiteSession } from "@/lib/getSiteSession";
import { getUsuarioPainel } from "@/db/adminQueries";
import { limparRealizados, listValores, upsertValor } from "@/db/indicadoresQueries";
import { mesesCiclo, unidadePorSlug } from "@/lib/indicadores";
import {
  chavesLegiveis,
  ehHead,
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
function exigeUnidade(slug: string | null | undefined) {
  const unidade = unidadePorSlug(slug?.trim());
  if (!unidade) {
    return { erro: NextResponse.json({ error: "Unidade desconhecida." }, { status: 400 }) };
  }
  return { unidade };
}

export async function GET(req: Request) {
  const { erro, usuario } = await exigeUsuario();
  if (erro) return erro;

  const { erro: erroUnidade, unidade } = exigeUnidade(new URL(req.url).searchParams.get("unidade"));
  if (erroUnidade) return erroUnidade;

  if (!podeAbrirUnidade(usuario, unidade.slug)) {
    return NextResponse.json({ error: "Sem acesso a esta unidade." }, { status: 403 });
  }

  const valores = await listValores(unidade.slug);
  const permitidas = chavesLegiveis(usuario, unidade);
  // Filtrar aqui, e não na tela: o colaborador não pode nem receber o número do
  // colega ou do N3 na resposta.
  return NextResponse.json(permitidas ? valores.filter((v) => permitidas.has(v.chave)) : valores);
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

  const { erro: erroUnidade, unidade } = exigeUnidade(body?.unidade);
  if (erroUnidade) return erroUnidade;

  const mes = body?.mes?.trim();
  const tipo = body?.tipo?.trim();
  const chave = body?.chave?.trim();

  if (!mes || !mesesCiclo().includes(mes)) {
    return NextResponse.json({ error: "Mês fora do ciclo do cronograma." }, { status: 400 });
  }
  if (!tipo || !TIPOS.includes(tipo as (typeof TIPOS)[number])) {
    return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
  }
  if (!chave) {
    return NextResponse.json({ error: "Chave do indicador é obrigatória." }, { status: 400 });
  }

  if (!podeGravar(usuario, { unidade: unidade.slug, tipo: tipo as "real" | "meta", chave })) {
    return NextResponse.json(
      { error: "Você só pode lançar o próprio realizado, na sua unidade." },
      { status: 403 }
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
  const { erro, usuario } = await exigeUsuario();
  if (erro) return erro;

  // Apagar os realizados do mês inteiro é ação de Head — um colaborador nunca
  // limpa lançamento, nem o próprio.
  if (!ehHead(usuario)) {
    return NextResponse.json({ error: "Acesso restrito ao Head." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const { erro: erroUnidade, unidade } = exigeUnidade(searchParams.get("unidade"));
  if (erroUnidade) return erroUnidade;

  const mes = searchParams.get("mes");
  if (!mes || !mesesCiclo().includes(mes)) {
    return NextResponse.json({ error: "Mês fora do ciclo do cronograma." }, { status: 400 });
  }

  await limparRealizados(unidade.slug, mes);
  return NextResponse.json({ ok: true });
}
