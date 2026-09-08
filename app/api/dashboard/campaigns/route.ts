import { NextResponse } from "next/server";
import { getCampaignPerformance } from "@/db/queries";
import { aplicaCustoReal, listCustosReais } from "@/db/custoCampanhaRealQueries";

export const dynamic = "force-dynamic";

export async function GET() {
  const [rows, custosReais] = await Promise.all([getCampaignPerformance(), listCustosReais()]);
  return NextResponse.json(aplicaCustoReal(rows, custosReais));
}
