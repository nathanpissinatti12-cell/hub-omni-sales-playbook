import { NextResponse } from "next/server";
import { createUser, logAdminAction, type AccessLevel, type BdrLevel } from "@/db/adminQueries";

export const dynamic = "force-dynamic";

const ACCESS_LEVELS: AccessLevel[] = ["bdr", "closer", "root"];
const BDR_LEVELS: BdrLevel[] = ["blue", "gold", "black", "platinum"];

type BulkResult = { email: string; ok: boolean; error?: string };

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    password?: string;
    users?: { name?: string; email?: string; accessLevel?: string; bdrLevel?: string }[];
  } | null;

  const password = body?.password ?? "";
  if (password.length < 6) {
    return NextResponse.json({ error: "Senha padrão deve ter pelo menos 6 caracteres." }, { status: 400 });
  }

  const rows = body?.users ?? [];
  if (rows.length === 0) {
    return NextResponse.json({ error: "Nenhum usuário informado." }, { status: 400 });
  }

  const results: BulkResult[] = [];

  for (const row of rows) {
    const name = row.name?.trim();
    const email = row.email?.trim().toLowerCase();
    const accessLevel = row.accessLevel?.trim().toLowerCase() as AccessLevel | undefined;
    const bdrLevelRaw = row.bdrLevel?.trim().toLowerCase() as BdrLevel | undefined;

    if (!name || !email) {
      results.push({ email: email || "(vazio)", ok: false, error: "Nome ou e-mail vazio." });
      continue;
    }
    if (!accessLevel || !ACCESS_LEVELS.includes(accessLevel)) {
      results.push({ email, ok: false, error: `Nível de acesso inválido: "${row.accessLevel}".` });
      continue;
    }
    const bdrLevel = accessLevel === "bdr" ? (bdrLevelRaw && BDR_LEVELS.includes(bdrLevelRaw) ? bdrLevelRaw : "blue") : null;

    try {
      const user = await createUser({ name, email, password, accessLevel, bdrLevel });
      await logAdminAction({
        action: "usuario_criado",
        targetUserId: user.id,
        targetUserName: user.name,
        details: `Criação em massa — Nível: ${accessLevel}${bdrLevel ? ` (${bdrLevel})` : ""}`,
      });
      results.push({ email, ok: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      results.push({
        email,
        ok: false,
        error: message.includes("admin_users_email_key") ? "E-mail já cadastrado." : "Erro ao criar.",
      });
    }
  }

  return NextResponse.json({ results });
}
