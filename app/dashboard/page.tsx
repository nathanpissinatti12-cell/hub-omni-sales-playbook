import { getFunnel, getRepPerformance, getRevenueByMonth } from "@/db/queries";
import { FunnelChart } from "@/components/charts/FunnelChart";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { RepsTable } from "@/components/charts/RepsTable";

export const dynamic = "force-dynamic";

function centsToBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function DashboardPage() {
  const [funnel, revenue, reps] = await Promise.all([
    getFunnel(),
    getRevenueByMonth(),
    getRepPerformance(),
  ]);

  const currentMonth = revenue[revenue.length - 1];
  const totalOpenDeals = funnel.reduce((acc: number, s) => acc + s.deal_count, 0);
  const firstStage = funnel[0]?.deal_count ?? 0;
  const lastStage = funnel[funnel.length - 1]?.deal_count ?? 0;
  const conversionRate = firstStage > 0 ? ((lastStage / firstStage) * 100).toFixed(1) : "0";

  const tiles = [
    { label: "Receita no mês", value: centsToBRL(Number(currentMonth?.revenue_cents ?? 0)) },
    { label: "Meta do mês", value: centsToBRL(Number(currentMonth?.target_cents ?? 0)) },
    { label: "Deals no funil", value: String(totalOpenDeals) },
    { label: "Conversão Lead → Fechamento", value: `${conversionRate}%` },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard de Vendas</h1>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>
          Dados ao vivo direto do banco de dados.
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
        <h2 className="mb-2 text-lg font-semibold">Funil de conversão</h2>
        <FunnelChart data={funnel} />
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 lg:grid-cols-6" style={{ color: "var(--text-muted)" }}>
          {funnel.map((s) => (
            <div key={s.id}>
              <span className="font-medium" style={{ color: "var(--text)" }}>
                {s.name}
              </span>
              : {s.avg_days_in_stage ?? "0"} dias em média
            </div>
          ))}
        </div>
      </section>

      <section
        className="rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="mb-2 text-lg font-semibold">Receita fechada vs. meta</h2>
        <RevenueChart data={revenue} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Ranking de vendedores</h2>
        <RepsTable data={reps} />
      </section>
    </div>
  );
}
