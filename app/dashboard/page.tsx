import Link from "next/link";
import { Target, Building2, UserX, Percent } from "lucide-react";
import {
  getCampaignPerformance,
  getGlobalContactStatus,
  getGlobalDailyProcessed,
  getGlobalMissingDataBreakdown,
  getGlobalTopStates,
  getSummary,
} from "@/db/queries";
import { CampaignsTable } from "@/components/charts/CampaignsTable";
import { DailyProcessedChart } from "@/components/charts/DailyProcessedChart";
import { ContactStatusDonut } from "@/components/charts/ContactStatusDonut";
import { MissingDataChart } from "@/components/charts/MissingDataChart";
import { TopStatesPie } from "@/components/charts/TopStatesPie";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [campaigns, summary, dailyProcessed, contactStatus, missingData, topStates] = await Promise.all([
    getCampaignPerformance(),
    getSummary(),
    getGlobalDailyProcessed(),
    getGlobalContactStatus(),
    getGlobalMissingDataBreakdown(),
    getGlobalTopStates(),
  ]);

  const globalSuccessRate =
    summary.total_fila > 0 ? ((summary.total_processado / summary.total_fila) * 100).toFixed(0) : "0";

  const tiles = [
    { label: "Campanhas ativas", value: String(summary.campanhas_ativas), icon: Target },
    { label: "Total na fila", value: String(summary.total_fila), icon: Building2 },
    { label: "Empresas enriquecidas", value: String(summary.total_empresas_enriquecidas), icon: UserX },
    { label: "Taxa de processamento", value: `${globalSuccessRate}%`, icon: Percent },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard de Prospecção</h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            Dados ao vivo da base de campanhas e enriquecimento de leads (Apollo).
          </p>
        </div>
        <Link
          href="/dashboard/indicadores"
          className="rounded-md px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          Painel de Indicadores
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.label}
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-md"
                style={{ background: "var(--accent)" }}
              >
                <Icon size={18} color="var(--on-accent)" />
              </div>
              <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                {tile.label}
              </p>
              <p className="mt-1 text-2xl font-semibold">{tile.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <h2 className="mb-2 text-lg font-semibold">Empresas Processadas por Dia</h2>
          <DailyProcessedChart data={dailyProcessed} />
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <h2 className="mb-2 text-lg font-semibold">Status dos Contatos</h2>
          <ContactStatusDonut data={contactStatus} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <h2 className="mb-2 text-lg font-semibold">Dados Faltantes (Apollo)</h2>
          <MissingDataChart data={missingData} />
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <h2 className="mb-2 text-lg font-semibold">Top Estados</h2>
          <TopStatesPie data={topStates} />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Desempenho por campanha</h2>
        <CampaignsTable data={campaigns} />
      </section>
    </div>
  );
}
