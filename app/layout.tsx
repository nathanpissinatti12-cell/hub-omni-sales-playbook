import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import "./globals.css";
import { MenuOnvox } from "@/components/MenuOnvox";
import { SiteWidgets } from "@/components/SiteWidgets";
import { getUsuarioPainel } from "@/db/adminQueries";
import { UNIDADES } from "@/lib/indicadores";
import { ehAdministrador } from "@/lib/acessoSistema";
import { PLAYBOOK_VISIVEL } from "@/lib/playbookVisivel";
import { ehHead } from "@/lib/permissaoIndicadores";
import { SiteLogoutButton } from "@/components/SiteLogoutButton";
import { SITE_SESSION_COOKIE, readSiteSession } from "@/lib/siteSession";

// Inter é a tipografia do brandbook da Onvox. Vem pelo next/font, que baixa no
// build e serve do próprio domínio — sem requisição ao Google no navegador do
// usuário e sem o salto de fonte que o @import causaria.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--fonte-onvox",
  display: "swap",
});

// O título da aba e o que vai no favorito seguem a mesma chave do menu: com o
// playbook oculto, a aba não deve anunciar a área escondida.
export const metadata: Metadata = PLAYBOOK_VISIVEL
  ? {
      title: "Playbook de Vendas",
      description: "Playbook de vendas e dashboard de performance",
    }
  : {
      title: "Hub Onvox",
      description: "Painel de indicadores e dashboard de performance",
    };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await readSiteSession(cookies().get(SITE_SESSION_COOKIE)?.value);

  // Unidades que este usuário pode abrir no Painel de Indicadores: Head vê
  // todas, colaborador vê só a dele, quem não tem vínculo não vê o menu.
  const usuarioPainel = session ? await getUsuarioPainel(session.uid) : null;
  const unidadesDoMenu = !usuarioPainel
    ? []
    : ehHead(usuarioPainel)
      ? UNIDADES.map((u) => ({ slug: u.slug, nome: u.nome }))
      : UNIDADES.filter((u) => u.slug === usuarioPainel.unidade && usuarioPainel.pessoaChave).map((u) => ({
          slug: u.slug,
          nome: u.nome,
        }));

  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        {/* Cabeçalho branco sobre o fundo Platinum da página, separado só por uma
            linha: a barra deixa de ser um bloco escuro e a marca aparece na
            versão roxa, que é a prevista para fundo claro. As cores vêm dos
            tokens do tema em vez de hex solto, para o cabeçalho acompanhar
            qualquer ajuste de paleta junto com o resto do site. */}
        <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
          <nav className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
            {/* Símbolo + palavra como no brandbook. São dois arquivos e não um
                só porque o símbolo sozinho serve de favicon e de marca em
                espaço curto. O alt fica só na palavra: juntos são uma marca,
                e dois textos alternativos seriam lidos em duplicata. */}
            <span className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/onvox-simbolo-light.png" alt="" aria-hidden="true" className="h-7 w-auto" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/onvox-logo-light.png" alt="Onvox" className="h-7 w-auto" />
            </span>
            {/* Oculto por enquanto — ver lib/playbookVisivel.ts. */}
            {PLAYBOOK_VISIVEL && (
              <Link href="/playbook" className="text-sm hover:underline" style={{ color: "var(--text)" }}>
                Playbook de Vendas
              </Link>
            )}
            {ehAdministrador(session?.accessLevel) && (
              <Link href="/dashboard" className="text-sm hover:underline" style={{ color: "var(--text)" }}>
                Dashboard
              </Link>
            )}
            {unidadesDoMenu.length > 0 && <MenuOnvox unidades={unidadesDoMenu} />}
            {/* Admin e Equipamentos são de administrador (root e owner). O
                menu lista só o que a pessoa consegue abrir; quem não é
                administrador e digitar a URL cai no /playbook, porque o
                middleware barra antes de a página existir. */}
            {ehAdministrador(session?.accessLevel) && (
              <>
                <Link href="/admin" className="text-sm hover:underline" style={{ color: "var(--text)" }}>
                  Admin
                </Link>
                <Link href="/equipamentos" className="text-sm hover:underline" style={{ color: "var(--text)" }}>
                  Equipamentos
                </Link>
              </>
            )}
            {session && (
              <span className="ml-auto">
                <SiteLogoutButton />
              </span>
            )}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        <SiteWidgets />
      </body>
    </html>
  );
}
