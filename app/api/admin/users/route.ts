import { NextResponse } from "next/server";
import { createUser, listUsers, logAdminAction, type AccessLevel, type BdrLevel } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

const ACCESS_LEVELS: AccessLevel[] = ["bdr", "closer", "root"];
const BDR_LEVELS: BdrLevel[] = ["blue", "gold", "black", "platinum"];

export async function GET() {
  const users = await listUsers();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
    photoDataUrl?: string | null;
    accessLevel?: string;
    bdrLevel?: string;
  } | null;

  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";
  const accessLevel = body?.accessLevel as AccessLevel | undefined;
  const bdrLevel = body?.bdrLevel as BdrLevel | undefined;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nome, e-mail e senha são obrigatórios." }, { status: 400 });
  }
  if (!accessLevel || !ACCESS_LEVELS.includes(accessLevel)) {
    return NextResponse.json({ error: "Nível de acesso inválido." }, { status: 400 });
  }
  if (accessLevel === "bdr" && (!bdrLevel || !BDR_LEVELS.includes(bdrLevel))) {
    return NextResponse.json({ error: "Nível BDR inválido." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres." }, { status: 400 });
  }

  try {
    const user = await createUser({
      name,
      email,
      password,
      photoDataUrl: body?.photoDataUrl ?? null,
      accessLevel,
      bdrLevel: accessLevel === "bdr" ? bdrLevel! : null,
    });
    await logAdminAction({
      action: "usuario_criado",
      targetUserId: user.id,
      targetUserName: user.name,
      details: `Nível: ${accessLevel}${accessLevel === "bdr" ? ` (${bdrLevel})` : ""}`,
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("admin_users_email_key")) {
      return NextResponse.json({ error: "Já existe um usuário com esse e-mail." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro ao criar usuário." }, { status: 500 });
  }
}
