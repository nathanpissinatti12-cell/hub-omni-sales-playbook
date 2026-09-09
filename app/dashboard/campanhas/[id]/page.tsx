import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCampaignById,
  getCampaignCnaeGroups,
  getCampaignFitScoreBreakdown,
  getCampaignLeadStatusBreakdown,
  getCampaignOriginBreakdown,
  getCampaignPerformance,
  getCampaignQueueStatusBreakdown,
  getCampaignRegionBreakdown,
  getCampaignSummary,
} from "@/db/queries";
import { getCampaignOriginTotal } from "@/lib/campaignOriginTotals";
import { getCustoReal } from "@/db/custoCampanhaRealQueries";
import { custoDaCampanha, custoDaCampanhaReal, explicaCusto, formataReais } from "@/lib/custoCampanha";
import { RegionChart } from "@/components/charts/RegionChart";
import { RankedTable } from "@/components/charts/RankedTable";
import { RankedList } from "@/components/charts/RankedList";
import { FitScoreChart } from "@/components/charts/FitScoreChart";
import { CustoRealForm } from "@/components/dashboard/CustoRealForm";

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

  const [summary, queueStatus, leadStatus, cnaeGroups, regionBreakdown, originBreakdown, fitScoreBreakdown, custoReal, performance] =
    await Promise.all([
      getCampaignSummary(campaign.id, campaign.nome),
      getCampaignQueueStatusBreakdown(campaign.nome),
      getCampaignLeadStatusBreakdown(campaign.nome),
      getCampaignCnaeGroups(campaign.id),
      getCampaignRegionBreakdown(campaign.id),
      getCampaignOriginBreakdown(campaign.nome),
      getCampaignFitScoreBreakdown(campaign.nome),
      getCustoReal(campaign.id),
      getCampaignPerformance(),
    ]);

  const originTotal = getCampaignOriginTotal(campaign.nome);

  const perf = performance.find((p) => p.id === campaign.id) ?? null;
  const custo =
    perf == null
      ? null
      : custoReal != null
        ? custoDaCampanhaReal({
            empresasConsultadas: perf.empresas_consultadas,
            creditosApolloReais: Number(custoReal.apollo_creditos_reais),
            deepseekUsdReais: Number(custoReal.deepseek_usd_reais),
            acertosHunter: perf.acertos_hunter,
            conferidoEm: custoReal.conferido_em ?? "",
          })
        : perf.custo_conferido
          ? custoDaCampanha(perf.empresas_consultadas, perf.acertos_hunter)
          : null;
  // Custo por lead que efetivamente subiu na Meetime — não por "empresa
  // enriquecida", que inclui quem nunca virou contato de verdade (sem e-mail
  // válido, sem decisor etc). Ver summary.criados_meetime (rank=1 no desfecho).
  const custoPorLeadMeetime = custo && summary.criados_meetime > 0 ? custo.totalReais / summary.criados_meetime : null;

  const taxaConversaoMeetime =
    summary.total_empresas > 0
      ? Math.round((summary.criados_meetime / summary.total_empresas) * 100)
      : 0;

  const tiles = [
    { label: "Empresas submetidas", value: summary.total_empresas },
    { label: "Criados na Meetime", value: summary.criados_meetime },
    { label: "Taxa de conversão para Meetime", value: `${taxaConversaoMeetime}%` },
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

      <section className="grid gap-4 lg:grid-cols-2">
        {originTotal !== null && (
          <div
            className="space-y-2 rounded-lg border p-4"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <h2 className="text-lg font-semibold">Origem: o que aconteceu com os leads enviados pela Apollo</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Total enrolado no Workflow da Apollo, e o que aconteceu com cada um a partir daí.
            </p>
            <RankedTable
              columns={["Etapa", "Quantidade"]}
              preserveOrder
              rows={[
                { label: "Total de leads (Apollo)", total: originTotal },
                { label: "Sem domínio (falha de mesclagem na Apollo)", total: originBreakdown.sem_dominio },
                { label: "Presentes na Meetime (criados + já existentes)", total: originBreakdown.criados_meetime },
                { label: "Perdidos por falta de e-mail válido", total: originBreakdown.sem_email },
              ]}
            />
          </div>
        )}

        <div
          className="space-y-2 rounded-lg border p-4"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
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
        </div>

        <div
          className="space-y-2 rounded-lg border p-4"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
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
        </div>

        <div
          className="space-y-2 rounded-lg border p-4"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <h2 className="text-lg font-semibold">Qualidade do telefone dos leads criados</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Só dá pra provar a faixa da nota (Qualidade do Dado), não o valor exato — a nota
            exata depende também da origem do e-mail, que o fluxo não grava no banco.
          </p>
          <FitScoreChart data={fitScoreBreakdown} />
        </div>

        <div
          className="space-y-2 rounded-lg border p-4"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <h2 className="text-lg font-semibold">Setores das empresas submetidas</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Grupos de atividade (CNAE) que aparecem entre as empresas desta campanha,
            do principal para os demais.
          </p>
          <RankedList
            title="Grupo de atividade"
            items={cnaeGroups.map((g) => ({ label: g.group, percentage: g.percentage }))}
          />
        </div>
      </section>

      <section
        className="space-y-2 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="text-lg font-semibold">Região das empresas (estado)</h2>
        <RegionChart data={regionBreakdown} />
      </section>

      <section
        className="space-y-2 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="text-lg font-semibold">Custo da campanha</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Custo total ÷ leads criados na Meetime — não empresas enriquecidas, que inclui quem nunca
          virou contato de verdade.
        </p>
        {custo == null ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Ainda sem cálculo conferido pra essa campanha.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Custo total</p>
              <p className="mt-1 text-xl font-semibold" title={explicaCusto(custo)}>
                {custo.medido ? "" : "~"}
                {formataReais(custo.totalReais)}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Leads criados na Meetime</p>
              <p className="mt-1 text-xl font-semibold">{summary.criados_meetime}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Custo por lead na Meetime</p>
              <p className="mt-1 text-xl font-semibold">
                {custoPorLeadMeetime == null ? "—" : `~${formataReais(custoPorLeadMeetime)}`}
              </p>
            </div>
          </div>
        )}
      </section>

      <CustoRealForm campanhaId={campaign.id} campanhaNome={campaign.nome} inicial={custoReal} />
    </div>
  );
}
