import { NextResponse } from "next/server";
import { getUserForLogin } from "@/db/adminQueries";
import { verifyPassword } from "@/lib/adminAuth";
import {
  SITE_SESSION_COOKIE,
  SITE_SESSION_MAX_AGE_SECONDS,
  SITE_SESSION_REMEMBER_MAX_AGE_SECONDS,
  createSiteSessionCookieValue,
} from "@/lib/siteSession";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    password?: string;
    remember?: boolean;
  } | null;
  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  const remember = body?.remember === true;

  if (!email || !password) {
    return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
  }

  const user = await getUserForLogin(email);
  if (!user || !user.active || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, name: user.name, accessLevel: user.access_level });
  res.cookies.set(SITE_SESSION_COOKIE, await createSiteSessionCookieValue(user.id, user.access_level, remember), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? SITE_SESSION_REMEMBER_MAX_AGE_SECONDS : SITE_SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
