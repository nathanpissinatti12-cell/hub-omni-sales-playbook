import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCampaignById,
  getCampaignCnaeGroups,
  getCampaignLeadStatusBreakdown,
  getCampaignQueueStatusBreakdown,
  getCampaignRegionBreakdown,
  getCampaignSummary,
} from "@/db/queries";
import { RegionChart } from "@/components/charts/RegionChart";
import { RankedTable } from "@/components/charts/RankedTable";
import { RankedList } from "@/components/charts/RankedList";

export const dynamic = "force-dynamic";

const QUEUE_STATUS_LABELS: Record<string, string> = {
  processado: "Processado",
  pendente: "Pendente",
  "em pausa": "Em pausa",
  erro: "Erro",
};

const LEAD_STATUS_LABELS: Record<string, string> = {
  "já existe na base": "Já existia na base",
  "criado meetime": "Criado no Meetime",
  "já existe na meetime": "Já existia no Meetime",
  "sem contato": "Sem contato encontrado",
  "sem decisor": "Sem decisor identificado",
  "sem pessoas": "Sem pessoas na empresa",
  "sem email valido": "Sem e-mail válido",
  "Não classificado": "Ainda não classificado",
};

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = await getCampaignById(params.id);
  if (!campaign) notFound();

  const [summary, queueStatus, leadStatus, cnaeGroups, regionBreakdown] = await Promise.all([
    getCampaignSummary(campaign.id, campaign.nome),
    getCampaignQueueStatusBreakdown(campaign.nome),
    getCampaignLeadStatusBreakdown(campaign.nome),
    getCampaignCnaeGroups(campaign.id),
    getCampaignRegionBreakdown(campaign.id),
  ]);

  const tiles = [
    { label: "Empresas submetidas", value: summary.total_empresas },
    { label: "Criados na Meetime", value: summary.criados_meetime },
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
        <h2 className="text-lg font-semibold">Status de processamento na fila</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Em que pé está cada item da fila desta campanha (coluna <code>status</code>).
        </p>
        <RankedTable
          columns={["Status", "Quantidade"]}
          rows={queueStatus.map((r) => ({
            label: QUEUE_STATUS_LABELS[r.status] ?? r.status,
            total: r.total,
          }))}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Status dos leads (todos, sucesso e falha)</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Resultado de cada lead processado — se foi enviado, se já existia, ou o motivo de
          não ter avançado (coluna <code>lead_status</code>).
        </p>
        <RankedTable
          columns={["Status do lead", "Quantidade"]}
          rows={leadStatus.map((r) => ({
            label: LEAD_STATUS_LABELS[r.status] ?? r.status,
            total: r.total,
          }))}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Setores das empresas submetidas</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Grupos de atividade (CNAE) que aparecem entre as empresas desta campanha,
          do principal para os demais.
        </p>
        <RankedList
          title="Grupo de atividade"
          items={cnaeGroups.map((g) => ({ label: g.group, percentage: g.percentage }))}
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
