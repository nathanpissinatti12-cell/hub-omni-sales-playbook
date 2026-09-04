import Link from "next/link";
import type { CampaignPerformanceRow } from "@/db/queries";
import { custoDaCampanha, explicaCusto, formataReais } from "@/lib/custoCampanha";

export function CampaignsTable({ data }: { data: CampaignPerformanceRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
            <th className="px-4 py-2 font-medium">Campanha</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium">Total na fila</th>
            <th className="px-4 py-2 font-medium">Taxa processado</th>
            <th className="px-4 py-2 font-medium">Empresas enriquecidas</th>
            <th className="px-4 py-2 font-medium">Criados Meetime</th>
            <th className="px-4 py-2 font-medium">Sem contato</th>
            <th className="px-4 py-2 font-medium">Custo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => {
            const custo = custoDaCampanha(c.empresas_consultadas);
            return (
            <tr key={c.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
              <td className="px-4 py-2">
                <Link href={`/dashboard/campanhas/${c.id}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                  {c.nome}
                </Link>
              </td>
              <td className="px-4 py-2" style={{ color: "var(--text-muted)" }}>{c.status}</td>
              <td className="px-4 py-2">{c.total_fila}</td>
              <td className="px-4 py-2">{c.taxa_processamento}%</td>
              <td className="px-4 py-2">{c.empresas_enriquecidas}</td>
              <td className="px-4 py-2">{c.criados_meetime}</td>
              <td className="px-4 py-2">{c.leads_sem_contato}</td>
              <td className="px-4 py-2 whitespace-nowrap" title={explicaCusto(custo)}>
                {custo.reais == null ? (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                ) : (
                  <>
                    ~{formataReais(custo.reais)}
                    <span className="ml-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      ({Math.round(custo.creditos)} cr)
                    </span>
                  </>
                )}
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
