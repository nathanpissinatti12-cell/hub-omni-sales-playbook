import { NextResponse } from "next/server";
import { deleteItem, updateItem } from "@/db/equipamentosQueries";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json().catch(() => null)) as {
    tipo?: string;
    descricao?: string;
    colaboradorId?: string | null;
  } | null;

  const tipo = body?.tipo?.trim();
  if (!tipo) {
    return NextResponse.json({ error: "Tipo é obrigatório." }, { status: 400 });
  }

  const item = await updateItem(params.id, {
    tipo,
    descricao: body?.descricao?.trim() || null,
    colaboradorId: body?.colaboradorId || null,
  });
  if (!item) {
    return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await deleteItem(params.id);
  return NextResponse.json({ ok: true });
}
