import { NextResponse } from "next/server";
import { DASHBOARD_SESSION_COOKIE } from "@/lib/dashboardSession";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASHBOARD_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
