import { NextResponse } from "next/server";
import { getSiteSession } from "@/lib/getSiteSession";
import { limparRealizados, listValores, upsertValor } from "@/db/indicadoresQueries";
import { mesesCiclo } from "@/lib/indicadores";

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

export async function GET() {
  const { erro } = await exigeRoot();
  if (erro) return erro;

  const valores = await listValores();
  return NextResponse.json(valores);
}

export async function POST(req: Request) {
  const { erro, session } = await exigeRoot();
  if (erro) return erro;

  const body = (await req.json().catch(() => null)) as {
    mes?: string;
    tipo?: string;
    chave?: string;
    valor?: number | string | null;
  } | null;

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
  const mes = searchParams.get("mes");
  if (!mes || !mesesCiclo().includes(mes)) {
    return NextResponse.json({ error: "Mês fora do ciclo do cronograma." }, { status: 400 });
  }

  await limparRealizados(mes);
  return NextResponse.json({ ok: true });
}
