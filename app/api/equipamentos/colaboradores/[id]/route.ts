import { NextResponse } from "next/server";
import {
  deleteColaborador,
  updateColaborador,
  updateColaboradorPosicao,
} from "@/db/equipamentosQueries";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json().catch(() => null)) as {
    nome?: string;
    setor?: string;
    posX?: number;
    posY?: number;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  // Arrasto no mapa: só posição, sem exigir nome.
  if (
    typeof body.posX === "number" &&
    typeof body.posY === "number" &&
    body.nome === undefined &&
    body.setor === undefined
  ) {
    const colaborador = await updateColaboradorPosicao(params.id, body.posX, body.posY);
    if (!colaborador) {
      return NextResponse.json({ error: "Colaborador não encontrado." }, { status: 404 });
    }
    return NextResponse.json(colaborador);
  }

  const nome = body.nome?.trim();
  if (!nome) {
    return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  }

  const colaborador = await updateColaborador(params.id, {
    nome,
    setor: body.setor?.trim() || null,
    posX: typeof body.posX === "number" ? body.posX : null,
    posY: typeof body.posY === "number" ? body.posY : null,
  });
  if (!colaborador) {
    return NextResponse.json({ error: "Colaborador não encontrado." }, { status: 404 });
  }
  return NextResponse.json(colaborador);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await deleteColaborador(params.id);
  return NextResponse.json({ ok: true });
}
