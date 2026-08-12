import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { Table } from "@/components/playbook/Table";
import { Callout } from "@/components/playbook/Callout";
import {
  AUDIENCES,
  GOLDEN_RULE,
  CS_COMPETENCIES,
  POST_SALE_ROLES,
  ONBOARDING_PREMISE,
  ONBOARDING_STAGES,
  ONBOARDING_TIMELINE,
  HANDOFF_CHECKLIST,
  SUCCESS_BY_ICP,
  SUCCESS_TABLE_USAGE,
  SUPPORT_INCLUDED,
  SUPPORT_VENDOR_NOT,
  SUPPORT_ESCALATION_STEPS,
  SUPPORT_HANDOFF_SCRIPT_CLIENT,
  SUPPORT_HANDOFF_INTERNAL_FIELDS,
  EXPANSION_TIMING,
  EXPANSION_OPPORTUNITIES,
  CHECKIN_90D_SCRIPT,
  CHURN_SIGNALS,
  CHURN_ACTION_PLAN,
  CHURN_RISK_SCRIPT,
  KPI_IMPLANTACAO,
  KPI_SUPORTE_RETENCAO,
  KPI_EXPANSAO,
  CHECKLIST_PROCESSOS_ESTRUTURA,
  CHECKLIST_METRICAS_FERRAMENTAS,
  CHECKLIST_TREINAMENTO_COMERCIAL,
  CHECKLIST_CULTURA_RITUAIS,
  ORIGIN_OMNI_M5,
  ORIGIN_EXTERNAL_M5,
} from "@/lib/playbookModule5";

function List({ title, items }: { title?: string; items: string[] }) {
  return (
    <div className="space-y-1">
      {title && <p className="text-sm font-medium">{title}</p>}
      <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function ChecklistBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{title}</h4>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden>☐</span>
            <span style={{ color: "var(--text-muted)" }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Modulo5Page() {
  return (
    <>
      <PlaybookSidebar activeModuleId={5} />

      <div className="playbook-content min-w-0 flex-1 space-y-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Playbook de Vendas — Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Módulo 5 — Pós-venda / Customer Success</h1>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Da assinatura à operação plena — e além · Versão 1.0 — Maio 2025
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="rounded-md border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
              <p className="font-medium">{a.title}</p>
              <p className="mt-1" style={{ color: "var(--text-muted)" }}>{a.desc}</p>
            </div>
          ))}
        </div>
        <Callout tone="blue" title="⚡ Regra de ouro da Omni">
          {GOLDEN_RULE}
        </Callout>

        {/* 5.1 */}
        <section id="m5-sec-1" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            5.1 — Perfil Ideal do Profissional de CS / Implantação
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            A Omni opera com um modelo onde toda a operação de pós-venda — implantação,
            treinamento, portabilidade e suporte contínuo — está centralizada na unidade de
            Tatuí. Isso garante padrão, especialização e um nível de atendimento que operadoras
            tradicionais não conseguem oferecer.
          </p>
          <p className="text-sm font-medium">O que buscamos neste profissional</p>
          <Table headers={["Competência", "Por que importa na Omni"]} rows={CS_COMPETENCIES} />
          <p className="text-sm font-medium">Diferença entre papéis pós-venda</p>
          <Table headers={["Papel", "Responsabilidade", "Quem executa"]} rows={POST_SALE_ROLES} />
        </section>

        {/* 5.2 */}
        <section id="m5-sec-2" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            5.2 — Processo de Onboarding do Cliente
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            O onboarding é o momento mais crítico da relação com o cliente. Uma implantação
            bem-feita cria fidelidade, aumenta o LTV e gera indicações. Uma implantação mal
            conduzida gera churn nos primeiros 90 dias.
          </p>
          <Callout tone="blue" title="Premissa da Omni">
            {ONBOARDING_PREMISE}
          </Callout>
          <p className="text-sm font-medium">As 5 Etapas do Onboarding Omni</p>
          <div className="space-y-4">
            {ONBOARDING_STAGES.map((stage) => (
              <div key={stage.title} className="rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-medium">{stage.title}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Responsável: {stage.responsavel} | Prazo: {stage.prazo}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
                  {stage.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-sm font-medium">Visão Geral da Linha do Tempo</p>
          <Table headers={["Etapa", "Prazo Médio", "Entregável", "Responsável"]} rows={ONBOARDING_TIMELINE} />
          <p className="text-sm font-medium">Handoff Comercial → Implantação: O que o Vendedor Deve Entregar</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Para que a unidade de Tatuí inicie o onboarding com qualidade, o vendedor precisa
            entregar informações completas no momento do fechamento.
          </p>
          <ChecklistBlock title="Checklist de Handoff — Vendedor → Implantação" items={HANDOFF_CHECKLIST} />
        </section>

        {/* 5.3 */}
        <section id="m5-sec-3" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            5.3 — Definição de Sucesso por Perfil de Cliente (ICP)
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Sucesso do cliente não é o mesmo para todo mundo. A Omni atende perfis distintos, e
            cada um tem uma definição própria do que &quot;funcionou&quot;. Conhecer isso permite
            que o time de CS priorize os resultados certos para cada cliente.
          </p>
          <Table
            headers={["Perfil de Cliente", "O que significa sucesso", "Indicador principal", "Risco de churn típico"]}
            rows={SUCCESS_BY_ICP}
          />
          <Callout tone="blue" title="Como usar esta tabela">
            {SUCCESS_TABLE_USAGE}
          </Callout>
        </section>

        {/* 5.4 */}
        <section id="m5-sec-4" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            5.4 — Suporte Contínuo: O Diferencial da Omni
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Um dos maiores diferenciais da Omni frente a operadoras tradicionais e plataformas
            SaaS genéricas é o suporte humanizado e completo oferecido pela unidade de Tatuí.
            Isso inclui não apenas resolver problemas, mas antecipar necessidades.
          </p>
          <List title="O que está incluído no suporte contínuo" items={SUPPORT_INCLUDED} />
          <Callout tone="tan" title="⚠️ Atenção — Para o time comercial">
            <div className="space-y-1">
              {SUPPORT_VENDOR_NOT.map((i) => (
                <p key={i}>{i}</p>
              ))}
            </div>
          </Callout>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Se um cliente entrar em contato com o vendedor sobre um problema técnico:
          </p>
          <List items={SUPPORT_ESCALATION_STEPS} />
          <p className="text-sm font-medium">Script de encaminhamento (vendedor → suporte Tatuí)</p>
          <Callout tone="blue" title="📞 Quando um cliente reportar problema técnico ao vendedor">
            <p>Ao cliente: {SUPPORT_HANDOFF_SCRIPT_CLIENT}</p>
          </Callout>
          <List title="Internamente: abrir chamado ou enviar mensagem ao time de Tatuí com" items={SUPPORT_HANDOFF_INTERNAL_FIELDS} />
        </section>

        {/* 5.5 */}
        <section id="m5-sec-5" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            5.5 — Playbook de Expansão de Conta (Upsell &amp; Cross-sell)
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Clientes satisfeitos são a maior fonte de crescimento da Omni. Após o onboarding,
            abre-se a janela de expansão — e o vendedor é o principal responsável por identificar
            e desenvolver essas oportunidades.
          </p>
          <p className="text-sm font-medium">Quando abordar expansão</p>
          <Table headers={["Momento", "Sinal", "Ação recomendada"]} rows={EXPANSION_TIMING} />
          <p className="text-sm font-medium">Oportunidades de Upsell e Cross-sell na Omni</p>
          <Table headers={["Situação atual do cliente", "Oportunidade de expansão", "Argumento-chave"]} rows={EXPANSION_OPPORTUNITIES} />
          <p className="text-sm font-medium">Script de Check-in de Expansão — 90 dias</p>
          <Callout tone="blue" title="📞 Check-in de 90 dias com o cliente">
            <div className="space-y-2">
              <p>Abertura: {CHECKIN_90D_SCRIPT.abertura}</p>
              <p>Se positivo: {CHECKIN_90D_SCRIPT.positivo}</p>
              <p>Se neutro/negativo: {CHECKIN_90D_SCRIPT.neutroNegativo}</p>
            </div>
          </Callout>
        </section>

        {/* 5.6 */}
        <section id="m5-sec-6" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            5.6 — Identificação de Risco de Churn e Plano de Ação
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Churn raramente é surpresa. Antes de um cliente cancelar, ele emite sinais. O trabalho
            do CS e do vendedor é identificar esses sinais cedo o suficiente para agir.
          </p>
          <p className="text-sm font-medium">Sinais de alerta (Early Warning Signals)</p>
          <Table headers={["Sinal", "Descrição", "O que pode indicar", "Ação imediata"]} rows={CHURN_SIGNALS} />
          <p className="text-sm font-medium">Plano de Ação Anti-Churn</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
            {CHURN_ACTION_PLAN.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ol>
          <Callout tone="pink" title="💬 Script de abordagem de cliente em risco">
            {CHURN_RISK_SCRIPT}
          </Callout>
        </section>

        {/* 5.7 */}
        <section id="m5-sec-7" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            5.7 — Métricas e KPIs do Pós-venda
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            O que não é medido não é gerenciado. Estas são as métricas que a Omni deve
            acompanhar para garantir que o pós-venda está entregando valor real — para o cliente
            e para o negócio.
          </p>
          <p className="text-sm font-medium">KPIs de Implantação</p>
          <Table headers={["Métrica", "Fórmula / Critério", "Meta sugerida", "Frequência"]} rows={KPI_IMPLANTACAO} />
          <p className="text-sm font-medium">KPIs de Suporte e Retenção</p>
          <Table headers={["Métrica", "Fórmula / Critério", "Meta sugerida", "Frequência"]} rows={KPI_SUPORTE_RETENCAO} />
          <p className="text-sm font-medium">KPIs de Expansão</p>
          <Table headers={["Métrica", "Fórmula / Critério", "Meta sugerida", "Frequência"]} rows={KPI_EXPANSAO} />
        </section>

        {/* Checklist + Origem */}
        <section id="m5-sec-8" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            ✅ Checklist de Implementação — Módulo 5
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Para o gestor responsável pela implantação deste módulo na Omni Assessoria:
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <ChecklistBlock title="Processos e Estrutura" items={CHECKLIST_PROCESSOS_ESTRUTURA} />
            <ChecklistBlock title="Métricas e Ferramentas" items={CHECKLIST_METRICAS_FERRAMENTAS} />
            <ChecklistBlock title="Treinamento do Time Comercial" items={CHECKLIST_TREINAMENTO_COMERCIAL} />
            <ChecklistBlock title="Cultura e Rituais" items={CHECKLIST_CULTURA_RITUAIS} />
          </div>

          <h3 className="text-lg font-medium">Origem das Práticas — Transparência Metodológica</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Este módulo combina a realidade operacional da Omni Assessoria com referências
            externas de mercado. Abaixo, a distinção:
          </p>
          <List title="Práticas originárias da Omni Assessoria" items={ORIGIN_OMNI_M5} />
          <List title="Referências externas adaptadas ao contexto da Omni" items={ORIGIN_EXTERNAL_M5} />

          <Callout tone="blue">
            <p className="font-medium">Módulo 5 concluído.</p>
            <p className="italic">O pós-venda da Omni não é um custo — é uma vantagem competitiva.</p>
          </Callout>
        </section>
      </div>
    </>
  );
}
