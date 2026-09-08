import { NextResponse } from "next/server";
import { getSiteSession } from "@/lib/getSiteSession";
import { deleteCustoReal, getCustoReal, upsertCustoReal } from "@/db/custoCampanhaRealQueries";

export const dynamic = "force-dynamic";

// O middleware já barra quem não é root em /api/dashboard/*, mas a checagem
// aqui também existe de propósito, igual em /api/dashboard/indicadores.
async function exigeRoot() {
  const session = await getSiteSession();
  if (!session) return { erro: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };
  if (session.accessLevel !== "root") {
    return { erro: NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 }) };
  }
  return { session };
}

export async function GET(req: Request) {
  const { erro } = await exigeRoot();
  if (erro) return erro;

  const { searchParams } = new URL(req.url);
  const campanhaId = searchParams.get("campanhaId");
  if (!campanhaId) {
    return NextResponse.json({ error: "campanhaId é obrigatório." }, { status: 400 });
  }

  const custo = await getCustoReal(campanhaId);
  return NextResponse.json(custo);
}

export async function POST(req: Request) {
  const { erro, session } = await exigeRoot();
  if (erro) return erro;

  const body = (await req.json().catch(() => null)) as {
    campanhaId?: string;
    campanhaNome?: string;
    apolloCreditosReais?: number | string;
    deepseekUsdReais?: number | string;
    conferidoEm?: string;
    observacao?: string | null;
  } | null;

  const campanhaId = body?.campanhaId?.trim();
  const campanhaNome = body?.campanhaNome?.trim();
  const conferidoEm = body?.conferidoEm?.trim();

  if (!campanhaId || !campanhaNome) {
    return NextResponse.json({ error: "campanhaId e campanhaNome são obrigatórios." }, { status: 400 });
  }
  if (!conferidoEm || !/^\d{4}-\d{2}-\d{2}$/.test(conferidoEm)) {
    return NextResponse.json({ error: "Data de conferência inválida (use AAAA-MM-DD)." }, { status: 400 });
  }

  const apolloCreditosReais = Number(body?.apolloCreditosReais);
  const deepseekUsdReais = Number(body?.deepseekUsdReais);
  if (!Number.isFinite(apolloCreditosReais) || apolloCreditosReais < 0) {
    return NextResponse.json({ error: "Créditos Apollo inválidos." }, { status: 400 });
  }
  if (!Number.isFinite(deepseekUsdReais) || deepseekUsdReais < 0) {
    return NextResponse.json({ error: "Custo DeepSeek (USD) inválido." }, { status: 400 });
  }

  await upsertCustoReal({
    campanhaId,
    campanhaNome,
    apolloCreditosReais,
    deepseekUsdReais,
    conferidoEm,
    observacao: body?.observacao?.trim() || null,
    updatedBy: session?.uid ?? null,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { erro } = await exigeRoot();
  if (erro) return erro;

  const { searchParams } = new URL(req.url);
  const campanhaId = searchParams.get("campanhaId");
  if (!campanhaId) {
    return NextResponse.json({ error: "campanhaId é obrigatório." }, { status: 400 });
  }

  await deleteCustoReal(campanhaId);
  return NextResponse.json({ ok: true });
}
