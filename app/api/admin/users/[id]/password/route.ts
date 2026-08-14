import { NextResponse } from "next/server";
import { getUserById, logAdminAction, updateUserPassword } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const existing = await getUserById(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as { newPassword?: string } | null;
  const newPassword = body?.newPassword ?? "";

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "A senha precisa ter pelo menos 6 caracteres." }, { status: 400 });
  }

  await updateUserPassword(params.id, newPassword);

  // Nunca registrar a senha em texto puro no histórico.
  await logAdminAction({
    action: "senha_redefinida",
    targetUserId: existing.id,
    targetUserName: existing.name,
    details: "Senha redefinida pelo administrador.",
  });

  return NextResponse.json({ ok: true });
}
