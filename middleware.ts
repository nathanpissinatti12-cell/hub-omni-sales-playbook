import { NextResponse, type NextRequest } from "next/server";
import { SITE_SESSION_COOKIE, readSiteSession } from "@/lib/siteSession";
import { allowedModules } from "@/lib/playbookAccess";
import { ehAdministrador } from "@/lib/acessoSistema";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- /admin e /equipamentos: login individual, nível de administrador ---
  //
  // Até 21/10/2026 estas rotas ficavam atrás de uma SENHA ÚNICA compartilhada
  // (ADMIN_PASSWORD), separada do login de cada pessoa. Saiu a pedido do dono
  // do projeto, e era o elo fraco do modelo de acesso: senha que todo mundo
  // digita não identifica ninguém — o histórico do /admin registrava a ação sem
  // saber quem a fez, e quem soubesse a senha editava permissão de qualquer um,
  // inclusive se promovendo. Agora quem entra é administrador (root ou owner)
  // pelo login dele.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/equipamentos") ||
    pathname.startsWith("/api/equipamentos")
  ) {
    const ehApi = pathname.startsWith("/api/admin") || pathname.startsWith("/api/equipamentos");
    const cookie = req.cookies.get(SITE_SESSION_COOKIE)?.value;
    const session = await readSiteSession(cookie);

    if (!session) {
      if (ehApi) {
        return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
      }
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // O nível vem do cookie assinado, que é o que o Edge consegue ler sem
    // banco. Quem muda de nível só sente na próxima entrada — para tirar acesso
    // na hora, desativar o usuário, que derruba a sessão na primeira rota que
    // consulta o banco.
    if (!ehAdministrador(session.accessLevel)) {
      if (ehApi) {
        return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/playbook", req.url));
    }
    return NextResponse.next();
  }

  // Resumo do Painel de Indicadores: quem chama é o n8n, que não tem cookie de
  // login. A rota autentica por token (INDICADORES_RESUMO_TOKEN) e recusa
  // sozinha quando o token falta ou não confere — por isso o middleware deixa
  // passar em vez de barrar com 401 de sessão. O middleware roda no Edge e não
  // deve ler segredo nem banco, então a decisão fica na rota mesmo.
  if (pathname === "/api/dashboard/indicadores/resumo") {
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

    // Painel de Indicadores: colaborador também entra, com visão parcial (N4 +
    // a própria linha do N5, só na unidade dele). Quem decide o que ele vê é a
    // página e, principalmente, a rota de API — o middleware roda no Edge e não
    // consulta banco, então aqui só libera a porta.
    const ehPainelIndicadores =
      pathname.startsWith("/dashboard/indicadores") || pathname.startsWith("/api/dashboard/indicadores");

    // Resto do dashboard: só administrador (root e owner).
    if (!ehPainelIndicadores && (pathname.startsWith("/dashboard") || pathname.startsWith("/api/dashboard"))) {
      if (!ehAdministrador(session.accessLevel)) {
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
