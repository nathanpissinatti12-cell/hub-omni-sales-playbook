import { NextResponse } from "next/server";
import { getSiteSession } from "@/lib/getSiteSession";
import { limparRealizados, listValores, upsertValor } from "@/db/indicadoresQueries";
import { mesesCiclo, unidadePorSlug } from "@/lib/indicadores";

export const dynamic = "force-dynamic";

// O middleware já barra quem não é root em /api/dashboard/*, mas a checagem
// aqui também existe de propósito: a rota nunca deve depender só do middleware
// pra proteger dado de meta/desempenho individual.
async function exigeRoot() {
  const session = await getSiteSession();
  if (!session) return { erro: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };
  if (session.accessLevel !== "root") {
    return { erro: NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 }) };
  }
  return { session };
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
  const { erro } = await exigeRoot();
  if (erro) return erro;

  const { erro: erroUnidade, unidade } = exigeUnidade(new URL(req.url).searchParams.get("unidade"));
  if (erroUnidade) return erroUnidade;

  const valores = await listValores(unidade.slug);
  return NextResponse.json(valores);
}

export async function POST(req: Request) {
  const { erro, session } = await exigeRoot();
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
  const { erro } = await exigeRoot();
  if (erro) return erro;

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
