import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCampaignById,
  getCampaignCnaeBreakdown,
  getCampaignLossReasons,
  getCampaignRegionBreakdown,
  getCampaignSummary,
} from "@/db/queries";
import { RegionChart } from "@/components/charts/RegionChart";
import { RankedTable } from "@/components/charts/RankedTable";

export const dynamic = "force-dynamic";

const LOSS_LABELS: Record<string, string> = {
  "sem contato": "Sem contato encontrado",
  "sem decisor": "Sem decisor identificado",
  "sem pessoas": "Sem pessoas na empresa",
  "sem email valido": "Sem e-mail válido",
};

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = await getCampaignById(params.id);
  if (!campaign) notFound();

  const [summary, lossReasons, cnaeBreakdown, regionBreakdown] = await Promise.all([
    getCampaignSummary(campaign.id, campaign.nome),
    getCampaignLossReasons(campaign.nome),
    getCampaignCnaeBreakdown(campaign.id),
    getCampaignRegionBreakdown(campaign.id),
  ]);

  const tiles = [
    { label: "Empresas submetidas", value: summary.total_empresas },
    { label: "Enviadas para o Meetime", value: summary.enviados_meetime },
    { label: "Perdidas", value: summary.perdidos },
  ];

  return (
    <div className="space-y-10">
      <div>
        <Link href="/dashboard" className="text-sm hover:underline" style={{ color: "var(--text-muted)" }}>
          ← Voltar ao dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{campaign.nome}</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Status da campanha: {campaign.status}
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
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

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Motivo das perdas</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Baseado no status de processamento de cada lead na fila desta campanha.
        </p>
        <RankedTable
          columns={["Motivo", "Quantidade"]}
          rows={lossReasons.map((r) => ({
            label: LOSS_LABELS[r.motivo] ?? r.motivo,
            total: r.total,
          }))}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Setores (CNAE) das empresas submetidas</h2>
        <RankedTable
          columns={["CNAE principal", "Empresas"]}
          rows={cnaeBreakdown.map((r) => ({ label: r.cnae, total: r.total }))}
        />
      </section>

      <section
        className="space-y-2 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="text-lg font-semibold">Região das empresas (estado)</h2>
        <RegionChart data={regionBreakdown} />
      </section>
    </div>
  );
}
