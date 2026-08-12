import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { Table } from "@/components/playbook/Table";
import { Callout } from "@/components/playbook/Callout";
import {
  BDR_PROFILE,
  BDR_RED_FLAGS,
  PRE_CALL_CHECKLIST,
  CADENCE,
  TEMPLATE_PATTERNS,
  CHANNEL_EFFORT,
  AIDA_STAGES,
  POST_BOOKING_QUESTIONS,
  VERTICAL_PAIN,
  EMAIL_PRINCIPLES,
  EMAIL_TEMPLATES,
  LINKEDIN_MESSAGES,
  WHATSAPP_MESSAGES,
  OBJECTIONS_M2,
  QUALIFYING_BY_PRODUCT,
  GPCT,
  GPCT_APPLICATION,
  SAL_CRITERIA,
  MEETIME_TEMPLATE,
  HANDOFF_STEPS,
  HANDOFF_WHY,
  LEAD_PRIORITY,
  KPI_PRODUTIVIDADE,
  KPI_EFICIENCIA,
  QUALITY_METRICS,
  OTE_FAIXAS,
  CHECKLIST_SETUP,
  CHECKLIST_ONBOARDING,
  CHECKLIST_ROTINA,
  CHECKLIST_AUDITORIA,
  CHECKLIST_TOOLS,
  ANTI_PLAYBOOK,
  ORIGENS_M2_OFICIAIS,
  ORIGENS_M2_EXTERNAS,
  ATTENTION_M2,
} from "@/lib/playbookModule2";

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

export default function Modulo2Page() {
  return (
    <>
      <PlaybookSidebar activeModuleId={2} />

      <div className="min-w-0 flex-1 space-y-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Playbook de Vendas — Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Módulo 2 — Pré-vendas (SDR/BDR)</h1>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Versão compilada e atualizada
          </p>
        </div>

        {/* 2.1 */}
        <section id="m2-sec-1" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.1 — Contexto e Filosofia da Pré-venda na Omni
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Na Omni, o BDR não é um agendador de reuniões. Ele é o primeiro consultor que o
            lead conhece. Cada cold call é, na prática, a primeira camada do Raio-X — o momento
            em que validamos se faz sentido a Omni investir tempo de um especialista naquela
            operação e, principalmente, se faz sentido o gestor investir 15 minutos da agenda
            dele em um diagnóstico.
          </p>
          <p className="text-sm font-medium">Isso muda tudo na forma como conduzimos o pré-vendas:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
            <li>Não vendemos software, vendemos diagnóstico. O BDR não está oferecendo TakeFlow, Onvox ou evolu.AI. Está oferecendo um Raio-X gratuito da operação de comunicação do prospect.</li>
            <li>Não somos telemarketing. Somos pares conversando com gestores. CEO para CEO, TI para TI, Marketing para Marketing.</li>
            <li>A reunião agendada é o produto. Tudo que o BDR faz culmina em uma SQL (Sales Qualified Lead) com SLA de qualificação rigoroso entregue ao closer.</li>
          </ul>
          <Callout tone="blue" title="Princípio central que todo BDR Omni precisa internalizar">
            &quot;Eu não estou ligando para vender. Estou ligando porque, na minha experiência com
            TIs de [vertical], identifiquei um padrão de perda oculta que eu acho que vale 15
            minutos da sua agenda checar.&quot;
          </Callout>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Esta postura — extraída diretamente das técnicas de Pattern Interrupt e Challenger
            Sale formalizadas no treinamento de 2026 — é o que diferencia o BDR Omni do
            telemarketing tradicional.
          </p>
        </section>

        {/* 2.2 */}
        <section id="m2-sec-2" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.2 — Perfil Ideal do BDR da Omni
          </h2>
          <h3 className="font-medium">O que buscamos (hard skills + comportamentais)</h3>
          <Table headers={["Dimensão", "Perfil ideal"]} rows={BDR_PROFILE.map((b) => [b.dimensao, b.perfil])} />

          <h3 className="font-medium">Sinais de alerta na contratação (red flags)</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
            {BDR_RED_FLAGS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          <h3 className="font-medium">Mapa de carreira — referência interna</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            O BDR Omni opera dentro de níveis de maturidade (Blue → Gold → Black → Platinum),
            que determinam a faixa de remuneração fixa. A progressão de nível não segue
            critérios quantitativos fixos: é avaliada com base em comportamento,
            comprometimento e resultado — a visão holística do que define um ótimo colaborador.
            A meta mensal (em SALs) é definida mensalmente pela gestão e varia conforme o nível
            e o momento da operação. O modelo de remuneração é OTE (On-Target Earnings),
            detalhado na seção 2.11.
          </p>
        </section>

        {/* 2.3 */}
        <section id="m2-sec-3" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.3 — Processo de Prospecção Outbound
          </h2>

          <div className="space-y-3">
            <h3 className="font-medium">2.3.1 — Pesquisa pré-ligação (15 minutos antes de discar)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Antes de qualquer ligação, o BDR Omni precisa ter:</p>
            <ul className="space-y-1 text-sm">
              {PRE_CALL_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden>☐</span>
                  <span style={{ color: "var(--text-muted)" }}>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
              Por que isso importa: o BDR que liga sem pesquisa cai no padrão de telemarketing e
              perde os primeiros 15 segundos — que são exatamente o momento mais crítico da
              chamada.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">2.3.2 — Cadência multicanal (oficial Omni — Meetime Flow)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              A cadência oficial da Omni é operada dentro do Meetime Flow e compreende 9 dias
              úteis com 13 toques, alternando ligação (canal-âncora) e canais digitais
              complementares (WhatsApp, LinkedIn, e-mail). O telefone aparece em todos os dias
              da cadência.
            </p>
            <Table
              headers={["Atividade", "Dia", "Canal", "Descrição"]}
              rows={CADENCE.map((c) => [c.atividade, c.dia, c.canal, c.descricao])}
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Padrão estrutural dos templates de abordagem</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Analisando os templates oficiais da Omni (cadência de ISPs como modelo de
              referência), identificamos 7 padrões consistentes que regem todos os templates:
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {TEMPLATE_PATTERNS.map((p) => (
                <li key={p.title}>
                  <span className="font-medium">{p.title}: </span>
                  <span style={{ color: "var(--text-muted)" }}>{p.detail}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Distribuição de esforço por canal (referência diária)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Baseado nos KPIs formalizados pela Omni (treinamento Prospecção 2026):
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              {CHANNEL_EFFORT.map((c) => (
                <li key={c.canal}><span className="font-medium" style={{ color: "var(--text)" }}>{c.canal}:</span> {c.meta}</li>
              ))}
            </ul>
            <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
              Princípio: o telefone é o canal-rei do BDR Omni. WhatsApp e e-mail são suportes da
              cadência, não substitutos da ligação.
            </p>
          </div>
        </section>

        {/* 2.4 */}
        <section id="m2-sec-4" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.4 — A Abordagem Oficial Omni (Cold Call)
          </h2>
          <Callout tone="blue">
            <strong>Esta é a única abordagem oficial de pré-vendas da Omni.</strong> Conforme
            orientação direta, ela substitui todas as variantes anteriores e foi formalizada
            para o vertical de farmácias (TI), servindo como modelo replicável para outras
            verticais.
          </Callout>

          <div className="space-y-4">
            <h3 className="font-medium">2.4.1 — Estrutura AIDA + Ação (script-base oficial)</h3>
            {AIDA_STAGES.map((stage) => (
              <div key={stage.stage} className="space-y-2 rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                  {stage.stage} <span className="font-normal normal-case" style={{ color: "var(--text-muted)" }}>({stage.timing})</span>
                </p>
                <Callout tone="gray">{stage.script}</Callout>
                <div>
                  <p className="text-xs font-medium">Por que funciona:</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
                    {stage.why.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Após o &quot;sim&quot; — 5 perguntas de mapeamento</h4>
              <Callout tone="gray">
                &quot;Perfeito, [Nome do Gestor]! Reunião agendada. Só para o meu especialista já
                ir com a lição de casa pronta e desenhar o melhor cenário para vocês no Raio-X,
                me tira umas dúvidas rápidas:&quot;
              </Callout>
              <ol className="list-decimal space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
                {POST_BOOKING_QUESTIONS.map((q) => (
                  <li key={q.q}>{q.q} <span className="italic">({q.maps})</span></li>
                ))}
              </ol>
              <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
                Por que funciona: oferece duas alternativas de horário (técnica de &quot;alternativas
                falsas&quot;) ao invés de &quot;quando você pode?&quot;. As 5 perguntas pós-agendamento são o
                micro-Raio-X que abastece o closer e reforça compromisso. O timing (15 min) é
                deliberadamente baixo para reduzir fricção — depois a reunião pode estender
                naturalmente.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">2.4.2 — Adaptação por vertical</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              A abordagem oficial é estruturalmente fixa, mas o gancho de dor (Interesse) deve
              ser adaptado por vertical:
            </p>
            <Table headers={["Vertical", "Dor a explorar"]} rows={VERTICAL_PAIN.map((v) => [v.vertical, v.dor])} />
            <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
              Regra de ouro: o gancho de dor sempre vem de &quot;hoje a gente atua em parceria com
              [tipo de gestor] de [vertical] e o que a gente vê é...&quot; — isso transmite
              autoridade contextual.
            </p>
          </div>
        </section>

        {/* 2.5 */}
        <section id="m2-sec-5" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.5 — Cold E-mail
          </h2>
          <h3 className="font-medium">2.5.1 — Princípios do e-mail Omni</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
            {EMAIL_PRINCIPLES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          <h3 className="font-medium">2.5.2 — Templates oficiais</h3>
          <div className="space-y-4">
            {EMAIL_TEMPLATES.map((t) => (
              <div key={t.title} className="space-y-2">
                <p className="text-sm font-medium">{t.title}</p>
                <Callout tone="gray">
                  <span className="font-semibold">Assunto: {t.subject}</span>
                  {"\n\n"}
                  {t.body}
                </Callout>
              </div>
            ))}
          </div>
        </section>

        {/* 2.6 */}
        <section id="m2-sec-6" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.6 — LinkedIn e WhatsApp
          </h2>
          <div className="space-y-3">
            <h3 className="font-medium">2.6.1 — Cadência LinkedIn</h3>
            {LINKEDIN_MESSAGES.map((m) => (
              <div key={m.title} className="space-y-1">
                <p className="text-sm font-medium">{m.title}</p>
                <Callout tone="gray">{m.text}</Callout>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">2.6.2 — WhatsApp (D1 e D9)</h3>
            <Callout tone="tan" title="Atenção">
              WhatsApp só após o gestor ter compartilhado o número (validar via secretária,
              LinkedIn ou no encerramento de ligação anterior). Disparo a frio em número não
              autorizado queima credibilidade e fere LGPD.
            </Callout>
            {WHATSAPP_MESSAGES.map((m) => (
              <div key={m.title} className="space-y-1">
                <p className="text-sm font-medium">{m.title}</p>
                <Callout tone="gray">{m.text}</Callout>
              </div>
            ))}
          </div>
        </section>

        {/* 2.7 */}
        <section id="m2-sec-7" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.7 — Tratamento de Objeções
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Princípio universal de objeção na Omni: nunca discutir o mérito da objeção. Sempre
            redirecionar para o Raio-X gratuito de 15 minutos. O Raio-X é o &quot;neutralizador
            universal&quot; — porque é grátis, é curto, e o gestor não tem o que perder.
          </p>
          <div className="space-y-3">
            {OBJECTIONS_M2.map((o, i) => (
              <div key={i} className="rounded-lg border" style={{ borderColor: "var(--border)" }}>
                <p className="px-4 py-2 text-sm font-medium" style={{ background: "var(--border)" }}>
                  Objeção {i + 1} — {o.question}
                </p>
                <p className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>{o.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2.8 */}
        <section id="m2-sec-8" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.8 — Framework de Qualificação: GPCT_BA_C&amp;I
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            A Omni adota o framework GPCT_BA_C&amp;I como metodologia oficial de qualificação. As
            perguntas estão adaptadas aos três produtos principais: TakeFlow, Onvox e evolu.AI.
          </p>

          <div className="space-y-4">
            <h3 className="font-medium">2.8.1 — Perguntas de qualificação por produto</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {QUALIFYING_BY_PRODUCT.map((p) => (
                <div key={p.product} className="rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                  <h4 className="text-sm font-medium">{p.product}</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
                    {p.questions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">2.8.2 — Perguntas GPCT_BA_C&amp;I oficiais</h3>
            <Table
              headers={["Etapa", "Pergunta", "O que mapeia"]}
              rows={GPCT.map((g) => [g.etapa, g.pergunta, g.mapeia])}
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">2.8.3 — Como aplicar na prática</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              O BDR não deve fazer todas as perguntas em uma única ligação. A aplicação ocorre
              em 3 momentos:
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              {GPCT_APPLICATION.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* 2.9 */}
        <section id="m2-sec-9" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.9 — Critérios de SAL e Handoff para o Closer
          </h2>

          <div className="space-y-3">
            <h3 className="font-medium">2.9.1 — O que é SAL na Omni</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Um lead só é considerado SAL (Sales Accepted Lead — oportunidade aceita pelo
              closer) quando atende todos os critérios obrigatórios abaixo:
            </p>
            <Table
              headers={["#", "Critério", "Como validar"]}
              rows={SAL_CRITERIA.map((c) => [c.n, c.criterio, c.como])}
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">2.9.2 — Padrão de registro no Meetime Flow (SLA de handoff)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Toda SAL passada para o closer deve ter os seguintes campos obrigatórios
              preenchidos no Meetime Flow antes de enviar a oportunidade ao CRM:
            </p>
            <Callout tone="gray">{MEETIME_TEMPLATE}</Callout>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">2.9.3 — Passagem de bastão na reunião (formato atual)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              O BDR entra na reunião de Raio-X junto com o closer, faz a abertura, apresenta o
              cliente, resume os desafios mapeados na prospecção e passa a palavra ao closer —
              depois sai da sala.
            </p>
            <p className="text-sm font-medium">Estrutura da passagem de bastão ao vivo (4 etapas)</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              {HANDOFF_STEPS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="text-sm font-medium">Por que esse formato funciona</p>
            <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              {HANDOFF_WHY.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2.10 */}
        <section id="m2-sec-10" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.10 — Classificação de Prioridade de Leads (A / B / C)
          </h2>
          <Table
            headers={["Prioridade", "Critério", "Ação do BDR"]}
            rows={LEAD_PRIORITY.map((l) => [l.prioridade, l.criterio, l.acao])}
          />
          <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
            Insight crítico: se o BDR detectar um lead C que tem dor aguda agora (ex: acabou de
            ter problema sério com operadora atual), o lead pode subir de C para A
            independente do tempo de contrato. Dor aguda &gt; timing contratual.
          </p>
        </section>

        {/* 2.11 */}
        <section id="m2-sec-11" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.11 — Métricas e KPIs do BDR
          </h2>

          <div className="space-y-3">
            <h3 className="font-medium">2.11.1 — KPIs oficiais Omni (mensais)</h3>
            <p className="text-sm font-medium">Indicadores de produtividade (esforço)</p>
            <Table
              headers={["KPI", "Meta mensal", "Meta diária"]}
              rows={KPI_PRODUTIVIDADE.map((k) => [k.kpi, k.mensal, k.diaria])}
            />
            <p className="text-sm font-medium">Indicadores de eficiência (resultado)</p>
            <Table
              headers={["KPI", "Meta", "Observação"]}
              rows={KPI_EFICIENCIA.map((k) => [k.kpi, k.meta, k.obs])}
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">2.11.2 — Métricas de qualidade (acompanhamento gerencial mensal)</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              {QUALITY_METRICS.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">2.11.3 — Modelo de remuneração OTE</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              A Omni opera com modelo OTE (On-Target Earnings). A meta mensal é definida pela
              gestão e varia conforme o nível e momento da operação. A tabela abaixo apresenta a
              estrutura de faixas de performance sobre a meta:
            </p>
            <Table
              headers={["Faixa", "% da Meta", "Leads SAL", "Multiplicador", "Bônus Final", "Total (Fixo + Bônus)"]}
              rows={OTE_FAIXAS.map((f) => [f.faixa, f.pct, f.leads, f.mult, f.bonus, f.total])}
            />
          </div>
        </section>

        {/* 2.12 */}
        <section id="m2-sec-12" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.12 — Checklist de Implementação para o Gestor de Pré-vendas
          </h2>
          <ChecklistBlock title="Setup inicial (fazer 1 vez)" items={CHECKLIST_SETUP} />
          <ChecklistBlock title="Onboarding de novo BDR (primeiros 30 dias)" items={CHECKLIST_ONBOARDING} />
          <ChecklistBlock title="Rotina semanal de gestão" items={CHECKLIST_ROTINA} />
          <ChecklistBlock title="Auditoria mensal de qualidade" items={CHECKLIST_AUDITORIA} />
          <ChecklistBlock title="Ferramentas obrigatórias por BDR" items={CHECKLIST_TOOLS} />
        </section>

        {/* 2.13 */}
        <section id="m2-sec-13" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            2.13 — Erros Mais Comuns no Pré-vendas Omni (antiplaybook)
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
            {ANTI_PLAYBOOK.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>

        {/* Procedência + Pontos de Atenção */}
        <section id="m2-sec-14" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            Procedência das Práticas
          </h2>
          <div className="space-y-2">
            <h3 className="font-medium">✅ Práticas extraídas dos materiais oficiais da Omni</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              {ORIGENS_M2_OFICIAIS.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">🔄 Práticas referenciadas/adaptadas de fontes externas</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              {ORIGENS_M2_EXTERNAS.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>

          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            Pontos de Atenção
          </h2>
          <Callout tone="pink" title="Sobre esta seção">
            Os temas abaixo foram mencionados ao longo do desenvolvimento do Módulo 2 mas não
            foram completamente desenvolvidos. Devem ser endereçados em próximas revisões.
          </Callout>
          <ol className="list-decimal space-y-2 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
            {ATTENTION_M2.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        </section>

        <p className="border-t pt-4 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          Omni Assessoria — Playbook de Vendas — Módulo 2 — Pré-vendas (SDR/BDR)
        </p>
      </div>
    </>
  );
}
