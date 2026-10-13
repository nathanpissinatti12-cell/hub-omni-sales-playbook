import Link from "next/link";
import { notFound } from "next/navigation";
import { PainelIndicadores } from "@/components/dashboard/indicadores/PainelIndicadores";
import { unidadePorSlug } from "@/lib/indicadores";

export const dynamic = "force-dynamic";

export default function PainelIndicadoresUnidadePage({ params }: { params: { unidade: string } }) {
  const unidade = unidadePorSlug(params.unidade);
  if (!unidade) notFound();

  return (
    <div className="tema-claro space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm hover:underline" style={{ color: "var(--text-muted)" }}>
          ← Voltar ao dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Painel de Indicadores — {unidade.nome}</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          N3 Head · N4 Supervisão · N5 Operação · Meta proporcional por dia útil
        </p>
      </div>

      {unidade.temDefinicao ? (
        <PainelIndicadores unidade={unidade} />
      ) : (
        <section
          className="rounded-lg border p-5"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <h2 className="text-lg font-semibold">Indicadores ainda não definidos</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            O {unidade.nome} tem indicadores próprios, diferentes das unidades comerciais, e a lista
            ainda não foi fechada. Enquanto isso o painel fica vazio de propósito — mostrar meta de
            MRR e de reunião aqui seria número de outra operação.
          </p>
          <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
            Para ligar este painel, preencha <b>MKT_N3</b>, <b>MKT_N4</b> e <b>MKT_PESSOAS</b> em
            <code className="mx-1">lib/indicadores.ts</code> e marque a unidade como
            <code className="mx-1">temDefinicao: true</code>. Os lançamentos já ficam separados por
            unidade no banco, então nada do que for lançado aqui mistura com as outras.
          </p>
        </section>
      )}
    </div>
  );
}
