import type { CampaignPerformanceRow } from "@/db/queries";

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
            <th className="px-4 py-2 font-medium">Enviados Meetime</th>
            <th className="px-4 py-2 font-medium">Sem contato</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
              <td className="px-4 py-2">{c.nome}</td>
              <td className="px-4 py-2" style={{ color: "var(--text-muted)" }}>{c.status}</td>
              <td className="px-4 py-2">{c.total_fila}</td>
              <td className="px-4 py-2">{c.taxa_processamento}%</td>
              <td className="px-4 py-2">{c.empresas_enriquecidas}</td>
              <td className="px-4 py-2">{c.enviados_meetime}</td>
              <td className="px-4 py-2">{c.leads_sem_contato}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
