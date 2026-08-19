import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import "./globals.css";
import { SiteWidgets } from "@/components/SiteWidgets";
import { SiteLogoutButton } from "@/components/SiteLogoutButton";
import { SITE_SESSION_COOKIE, readSiteSession } from "@/lib/siteSession";

export const metadata: Metadata = {
  title: "Playbook de Vendas",
  description: "Playbook de vendas e dashboard de performance",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await readSiteSession(cookies().get(SITE_SESSION_COOKIE)?.value);

  return (
    <html lang="pt-BR">
      <body>
        <header style={{ background: "#0a0a0a", borderBottom: "1px solid #ffffff1f" }}>
          <nav className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/omni-logo-dark.png" alt="Omni Assessoria" className="h-7 w-auto" />
            <Link href="/playbook" className="text-sm hover:underline" style={{ color: "#f5f5f0" }}>
              Playbook de Vendas
            </Link>
            {session?.accessLevel === "root" && (
              <Link href="/dashboard" className="text-sm hover:underline" style={{ color: "#f5f5f0" }}>
                Dashboard
              </Link>
            )}
            <Link href="/admin" className="text-sm hover:underline" style={{ color: "#f5f5f0" }}>
              Admin
            </Link>
            <Link href="/equipamentos" className="text-sm hover:underline" style={{ color: "#f5f5f0" }}>
              Equipamentos
            </Link>
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
