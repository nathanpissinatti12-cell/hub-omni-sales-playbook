import Link from "next/link";
import type { CampaignPerformanceRow } from "@/db/queries";
import { custoDaCampanha, custoDaCampanhaReal, explicaCusto, formataReais } from "@/lib/custoCampanha";
import { encerradaEm, formataDataEncerramento } from "@/lib/campanhaEncerrada";
import { creditosTelefoneReais } from "@/lib/creditosTelefoneReais";

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
            <th className="px-4 py-2 font-medium">Custo/lead Meetime</th>
            <th className="px-4 py-2 font-medium">Encerrada em</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => {
            const custo =
              c.custo_real_apollo_creditos != null && c.custo_real_deepseek_usd != null
                ? custoDaCampanhaReal({
                    empresasConsultadas: c.empresas_consultadas,
                    creditosApolloReais: c.custo_real_apollo_creditos,
                    deepseekUsdReais: c.custo_real_deepseek_usd,
                    acertosHunter: c.acertos_hunter,
                    conferidoEm: c.custo_real_conferido_em ?? "",
                    cicloApolloNovo: c.ciclo_apollo_novo,
                    creditosTelefoneMedidos: creditosTelefoneReais(c.nome),
                  })
                : c.custo_conferido
                  ? custoDaCampanha(c.empresas_consultadas, c.acertos_hunter, c.ciclo_apollo_novo, creditosTelefoneReais(c.nome))
                  : null;
            const custoPorLead = custo && c.criados_meetime > 0 ? custo.totalReais / c.criados_meetime : null;
            const encerrada = encerradaEm(c.nome);
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
              <td
                className="px-4 py-2 whitespace-nowrap"
                title={custo ? explicaCusto(custo) : "Cálculo ainda não conferido contra o consumo real desta campanha"}
              >
                {custo == null ? (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                ) : (
                  <>
                    {custo.medido ? "" : "~"}
                    {formataReais(custo.totalReais)}
                    <span className="ml-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      ({Math.round(custo.creditosApollo)} cr Apollo{custo.medido ? ", medido" : ""}
                      {custo.telefoneMedido ? ` + ${Math.round(custo.creditosTelefone)} cr telefone, medido` : ""})
                    </span>
                  </>
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap" title="Custo total ÷ leads criados na Meetime (não empresas enriquecidas — nem toda enriquecida vira lead na Meetime)">
                {custoPorLead == null ? (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                ) : (
                  `~${formataReais(custoPorLead)}`
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                {encerrada == null ? "—" : formataDataEncerramento(encerrada)}
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
