import { NextResponse } from "next/server";
import { getUserForLogin } from "@/db/adminQueries";
import { verifyPassword } from "@/lib/adminAuth";
import {
  DASHBOARD_SESSION_COOKIE,
  DASHBOARD_SESSION_MAX_AGE_SECONDS,
  createDashboardSessionCookieValue,
} from "@/lib/dashboardSession";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
  }

  const user = await getUserForLogin(email);
  if (!user || !user.active || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
  }
  if (user.access_level !== "root") {
    return NextResponse.json({ error: "Seu usuário não tem acesso ao Dashboard — apenas administradores." }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true, name: user.name });
  res.cookies.set(DASHBOARD_SESSION_COOKIE, await createDashboardSessionCookieValue(user.id, user.access_level), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DASHBOARD_SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
