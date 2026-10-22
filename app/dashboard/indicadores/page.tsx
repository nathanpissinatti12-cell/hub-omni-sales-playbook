import Link from "next/link";
import { redirect } from "next/navigation";
import { contagemVinculosPorUnidade, getUsuarioPainel } from "@/db/adminQueries";
import { getSiteSession } from "@/lib/getSiteSession";
import { UNIDADES } from "@/lib/indicadores";
import { painelLiberado, podeAbrirUnidade } from "@/lib/permissaoIndicadores";

export const dynamic = "force-dynamic";

/**
 * Escolha da unidade. Era um redirecionamento fixo para Cerquilho, de quando
 * havia um painel só; virou tela porque "Painel de Indicadores" passou a ser um
 * item do menu de cima, e menu que leva direto a uma unidade esconde as outras
 * quatro de quem tem acesso a elas.
 *
 * Com uma unidade só na lista, continua redirecionando: cartão único é clique a
 * mais para escolher o que já estava escolhido.
 */
export default async function EscolherUnidadePage() {
  const session = await getSiteSession();
  if (!session) redirect("/login");

  const usuario = await getUsuarioPainel(session.uid);
  if (!usuario || !painelLiberado(usuario)) {
    return (
      <div className="tema-claro">
        <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <h1 className="text-lg font-semibold">Você ainda não tem acesso ao painel</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            O Painel de Indicadores mostra meta e desempenho individual, então o acesso é dado
            pessoa a pessoa. Peça a um administrador para vincular seu usuário a uma unidade e a um
            nível (N3, N4 ou N5).
          </p>
        </div>
      </div>
    );
  }

  const permitidas = UNIDADES.filter((u) => podeAbrirUnidade(usuario, u.slug));
  if (permitidas.length === 1) {
    redirect(`/dashboard/indicadores/${permitidas[0].slug}`);
  }

  const vinculos = await contagemVinculosPorUnidade();

  return (
    <div className="tema-claro space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Painel de Indicadores</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Escolha a unidade. Cada uma tem o próprio N3, N4 e time — e o próprio RMR.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {permitidas.map((u) => {
          const pessoas = vinculos[u.slug] ?? 0;
          return (
            <Link
              key={u.slug}
              href={`/dashboard/indicadores/${u.slug}`}
              className="rounded-lg border p-5 transition-colors hover:border-[var(--accent)]"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <span className="block text-lg font-semibold">{u.nome}</span>
              {/* Dizer o que há do outro lado evita o clique que abre um painel
                  vazio — é o caso das unidades sem ninguém vinculado. */}
              <span className="mt-1 block text-sm" style={{ color: "var(--text-muted)" }}>
                {!u.temDefinicao
                  ? "Indicadores ainda não definidos"
                  : pessoas === 0
                    ? "N3 e N4 · ninguém vinculado ao N5"
                    : `N3 e N4 · ${pessoas} ${pessoas === 1 ? "pessoa" : "pessoas"} no N5`}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
