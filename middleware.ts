import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionCookieValue } from "@/lib/adminSession";
import { SITE_SESSION_COOKIE, readSiteSession } from "@/lib/siteSession";
import { allowedModules } from "@/lib/playbookAccess";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- /admin e /equipamentos: mesma senha única compartilhada ---
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/equipamentos") ||
    pathname.startsWith("/api/equipamentos")
  ) {
    const isLoginPage = pathname === "/admin/login";
    const isLoginApi = pathname === "/api/admin/login";
    if (isLoginPage || isLoginApi) {
      return NextResponse.next();
    }

    const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const authenticated = await isValidSessionCookieValue(cookie);

    if (!authenticated) {
      if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/equipamentos")) {
        return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // --- /playbook e /dashboard: login individual (admin_users) ---
  if (pathname.startsWith("/playbook") || pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard")) {
    const cookie = req.cookies.get(SITE_SESSION_COOKIE)?.value;
    const session = await readSiteSession(cookie);

    if (!session) {
      if (pathname.startsWith("/api/dashboard")) {
        return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
      }
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Dashboard: só Root.
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard")) {
      if (session.accessLevel !== "root") {
        if (pathname.startsWith("/api/dashboard")) {
          return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/playbook", req.url));
      }
      return NextResponse.next();
    }

    // Playbook: módulo precisa estar liberado pro cargo do usuário.
    const moduleMatch = pathname.match(/^\/playbook\/modulo-(\d+)/);
    if (moduleMatch) {
      const moduleNum = Number(moduleMatch[1]);
      const allowed = allowedModules(session.accessLevel);
      if (allowed !== "all" && !allowed.includes(moduleNum)) {
        const fallback = allowed[0] ?? 1;
        return NextResponse.redirect(new URL(`/playbook/modulo-${fallback}`, req.url));
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/equipamentos/:path*",
    "/api/equipamentos/:path*",
    "/dashboard/:path*",
    "/api/dashboard/:path*",
    "/playbook/:path*",
  ],
};
