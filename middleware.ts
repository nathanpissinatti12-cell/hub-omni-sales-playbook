import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionCookieValue } from "@/lib/adminSession";
import { DASHBOARD_SESSION_COOKIE, readDashboardSession } from "@/lib/dashboardSession";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const isLoginApi = pathname === "/api/admin/login";
    if (isLoginPage || isLoginApi) {
      return NextResponse.next();
    }

    const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const authenticated = await isValidSessionCookieValue(cookie);

    if (!authenticated) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard")) {
    const isLoginPage = pathname === "/dashboard/login";
    const isLoginApi = pathname === "/api/dashboard/login";
    if (isLoginPage || isLoginApi) {
      return NextResponse.next();
    }

    const cookie = req.cookies.get(DASHBOARD_SESSION_COOKIE)?.value;
    const session = await readDashboardSession(cookie);
    const authorized = session?.accessLevel === "root";

    if (!authorized) {
      if (pathname.startsWith("/api/dashboard")) {
        return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
      }
      const loginUrl = new URL("/dashboard/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/dashboard/:path*", "/api/dashboard/:path*"],
};
