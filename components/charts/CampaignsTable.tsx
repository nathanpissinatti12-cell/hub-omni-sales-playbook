import Link from "next/link";
import type { CampaignPerformanceRow } from "@/db/queries";
import { explicaCusto, formataReais, origemDoCusto } from "@/lib/custoCampanha";
import { custoDaLinha, formataJanela } from "@/lib/custoDaLinha";
import { encerradaEm, formataDataEncerramento } from "@/lib/campanhaEncerrada";
import { celularesRevelados } from "@/lib/celularesRevelados";

export function CampaignsTable({ data }: { data: CampaignPerformanceRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
            <th className="px-3 py-2 font-medium">Campanha</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Rodou em</th>
            <th className="px-3 py-2 font-medium">Encerrada em</th>
            <th className="px-3 py-2 font-medium">Total na fila</th>
            <th className="px-3 py-2 font-medium">Taxa processado</th>
            <th className="px-3 py-2 font-medium">Empresas enriquecidas</th>
            <th className="px-3 py-2 font-medium">% celular revelado</th>
            <th className="px-3 py-2 font-medium">Criados Meetime</th>
            <th className="px-3 py-2 font-medium">Sem contato</th>
            <th className="px-3 py-2 font-medium">Custo</th>
            <th className="px-3 py-2 font-medium">Custo/lead Meetime</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => {
            const custo = custoDaLinha(c);
            const custoPorLead = custo && c.criados_meetime > 0 ? custo.totalReais / c.criados_meetime : null;
            const encerrada = encerradaEm(c.nome);
            const revelados = celularesRevelados(c.nome);
            const janela = formataJanela(c.rodou_inicio, c.rodou_fim);
            const percentRevelado = revelados != null && c.empresas_enriquecidas > 0 ? (revelados / c.empresas_enriquecidas) * 100 : null;
            return (
            <tr key={c.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
              <td className="px-3 py-2">
                <Link href={`/dashboard/campanhas/${c.id}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                  {c.nome}
                </Link>
              </td>
              <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>{c.status}</td>
              <td
                className="px-3 py-2 whitespace-nowrap"
                style={{ color: "var(--text-muted)" }}
                title={
                  janela
                    ? "Primeira e última chamada do Gemini na campanha — a janela real de execução do fluxo."
                    : "A campanha rodou antes do registro de uso do Gemini existir (22/10/2026)."
                }
              >
                {janela ?? "—"}
              </td>
              <td className="px-3 py-2 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                {encerrada == null ? "—" : formataDataEncerramento(encerrada)}
              </td>
              <td className="px-3 py-2">{c.total_fila}</td>
              <td className="px-3 py-2">{c.taxa_processamento}%</td>
              <td className="px-3 py-2">{c.empresas_enriquecidas}</td>
              <td
                className="px-3 py-2 whitespace-nowrap"
                style={{ color: "var(--text-muted)" }}
                title={
                  revelados != null
                    ? `${revelados} celulares revelados (medido) de ${c.empresas_enriquecidas} empresas enriquecidas`
                    : "Ainda não medido pra essa campanha"
                }
              >
                {percentRevelado == null ? "—" : `${percentRevelado.toFixed(0)}%`}
              </td>
              <td className="px-3 py-2">{c.criados_meetime}</td>
              <td className="px-3 py-2">{c.leads_sem_contato}</td>
              <td
                className="px-3 py-2 whitespace-nowrap"
                title={custo ? explicaCusto(custo) : "Cálculo ainda não conferido contra o consumo real desta campanha"}
              >
                {custo == null ? (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                ) : (
                  <>
                    {origemDoCusto(custo) === "real" ? "" : "~"}
                    {formataReais(custo.totalReais)}{" "}
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      ({origemDoCusto(custo)})
                    </span>
                    <span className="block text-xs" style={{ color: "var(--text-muted)" }}>
                      {Math.round(custo.creditosApollo)} cr Apollo{custo.medido ? " (real)" : " (estimado)"}
                    </span>
                  </>
                )}
              </td>
              <td className="px-3 py-2 whitespace-nowrap" title="Custo total ÷ leads criados na Meetime (não empresas enriquecidas — nem toda enriquecida vira lead na Meetime)">
                {custoPorLead == null ? (
                  <span style={{ color: "var(--text-muted)" }}>—</span>
                ) : (
                  `~${formataReais(custoPorLead)}`
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
