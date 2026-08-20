import { NextResponse } from "next/server";
import { createColaborador, listColaboradores } from "@/db/equipamentosQueries";

export const dynamic = "force-dynamic";

export async function GET() {
  const colaboradores = await listColaboradores();
  return NextResponse.json(colaboradores);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    nome?: string;
    setor?: string;
    posX?: number;
    posY?: number;
    isDeposito?: boolean;
  } | null;

  const nome = body?.nome?.trim();
  if (!nome) {
    return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  }

  const colaborador = await createColaborador({
    nome,
    setor: body?.setor?.trim() || null,
    posX: typeof body?.posX === "number" ? body.posX : null,
    posY: typeof body?.posY === "number" ? body.posY : null,
    isDeposito: body?.isDeposito === true,
  });
  return NextResponse.json(colaborador, { status: 201 });
}
