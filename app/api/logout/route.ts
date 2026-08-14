import { NextResponse } from "next/server";
import { SITE_SESSION_COOKIE } from "@/lib/siteSession";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SITE_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
