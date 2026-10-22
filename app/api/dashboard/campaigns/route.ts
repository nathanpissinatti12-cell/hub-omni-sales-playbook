import { NextResponse } from "next/server";
import { getCampaignPerformance } from "@/db/queries";
import { aplicaCustoReal, listCustosReais } from "@/db/custoCampanhaRealQueries";
import { quemVeDashboard } from "@/lib/acessoDashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  // A checagem passou a ser aqui: o middleware deixou de barrar por nível
  // porque o nível do painel não cabe no cookie (ver comentário lá). Esta rota
  // devolve o desempenho de todas as campanhas — não é dado de colaborador.
  if (!(await quemVeDashboard())) {
    return NextResponse.json({ error: "Acesso restrito." }, { status: 403 });
  }

  const [rows, custosReais] = await Promise.all([getCampaignPerformance(), listCustosReais()]);
  return NextResponse.json(aplicaCustoReal(rows, custosReais));
}
