import { NextResponse } from "next/server";
import { createItem, listItens } from "@/db/equipamentosQueries";

export const dynamic = "force-dynamic";

export async function GET() {
  const itens = await listItens();
  return NextResponse.json(itens);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    tipo?: string;
    descricao?: string;
    colaboradorId?: string | null;
  } | null;

  const tipo = body?.tipo?.trim();
  if (!tipo) {
    return NextResponse.json({ error: "Tipo é obrigatório." }, { status: 400 });
  }

  const item = await createItem({
    tipo,
    descricao: body?.descricao?.trim() || null,
    colaboradorId: body?.colaboradorId || null,
  });
  return NextResponse.json(item, { status: 201 });
}
