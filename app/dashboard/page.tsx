import { getCampaignPerformance, getSummary } from "@/db/queries";
import { CampaignsChart } from "@/components/charts/CampaignsChart";
import { CampaignsTable } from "@/components/charts/CampaignsTable";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [campaigns, summary] = await Promise.all([getCampaignPerformance(), getSummary()]);

  const globalSuccessRate =
    summary.total_fila > 0 ? ((summary.total_processado / summary.total_fila) * 100).toFixed(1) : "0";

  const tiles = [
    { label: "Campanhas ativas", value: String(summary.campanhas_ativas) },
    { label: "Total na fila", value: String(summary.total_fila) },
    { label: "Taxa de processamento", value: `${globalSuccessRate}%` },
    { label: "Enviados para o Meetime", value: String(summary.total_enviados_meetime) },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard de Prospecção</h1>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>
          Dados ao vivo da base de campanhas e enriquecimento de leads (Apollo).
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-lg border p-4"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {tile.label}
            </p>
            <p className="mt-1 text-xl font-semibold">{tile.value}</p>
          </div>
        ))}
      </section>

      <section
        className="rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="mb-2 text-lg font-semibold">Status da fila por campanha (top 8 por volume)</h2>
        <CampaignsChart data={campaigns} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Desempenho por campanha</h2>
        <CampaignsTable data={campaigns} />
      </section>
    </div>
  );
}
