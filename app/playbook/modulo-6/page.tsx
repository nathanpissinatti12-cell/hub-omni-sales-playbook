import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { Table } from "@/components/playbook/Table";
import { Callout } from "@/components/playbook/Callout";
import {
  CULTURE_PILLARS,
  HIRING_PROFILES,
  HIRING_COST_NOTE,
  BDR_CAREER_LEVELS,
  BDR_PROGRESSION_NOTE,
  BDR_NEXT_STEP,
  BDR_PROGRESSION_PROCESS,
  CLOSER_CAREER_LEVELS,
  CLOSER_LEADERSHIP_NOTE,
  RITUALS,
  COMP_PRINCIPLES,
  CLOSER_PERFORMANCE_TIERS,
  BDR_GOAL_NOTE,
  CS_VARIABLE_METRICS,
  MANAGER_COMP_NOTE,
  COMP_GOLDEN_RULES,
  RAMPUP_INTRO,
  BDR_RAMPUP_WEEK1,
  BDR_RAMPUP_WEEK1_PIPELOVERS,
  BDR_RAMPUP_WEEK2,
  BDR_RAMPUP_WEEK3,
  BDR_RAMPUP_WEEK4,
  BDR_RAMPUP_AFTER,
  CLOSER_RAMPUP_WEEK1_2,
  CLOSER_RAMPUP_WEEK3_4,
  CLOSER_RAMPUP_WEEK5_6,
  CLOSER_RAMPUP_AFTER,
  CLOSER_RAMPUP_G4,
  TOOL_STACK,
  PIPELOVERS_PRACTICE,
  PIPELOVERS_ROUTINE,
  G4_SKILLS_PRACTICE,
  PIPELOVERS_VS_G4,
  RECOGNITION_INTRO,
  RECOGNITION_MECHANISMS,
  PERFORMANCE_AVOID,
  CHECKLIST_SETUP_INICIAL,
  CHECKLIST_ONBOARDING_COLABORADOR,
  CHECKLIST_RITUAIS_MENSAL,
  CHECKLIST_CULTURA_SAUDE,
  ATTENTION_M6,
} from "@/lib/playbookModule6";

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

export default function Modulo6Page() {
  return (
    <>
      <PlaybookSidebar activeModuleId={6} />

      <div className="min-w-0 flex-1 space-y-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Playbook de Vendas — Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Módulo 6 — Cultura, Gestão e Rituais Comerciais</h1>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Versão 1.0 — Maio 2026</p>
        </div>

        {/* 6.1 */}
        <section id="m6-sec-1" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            6.1 — A Cultura Comercial da Omni
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Antes de qualquer ritual ou ferramenta, a Omni precisa ter clareza sobre o que define
            sua cultura comercial. Cultura não é o que está escrito na parede — é o que o time faz
            quando o gestor não está olhando.
          </p>
          <div className="space-y-3">
            {CULTURE_PILLARS.map((p) => (
              <div key={p.title}>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6.2 */}
        <section id="m6-sec-2" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            6.2 — Perfil de Profissional que a Omni Deve Contratar por Função
          </h2>
          <Callout tone="tan">{HIRING_COST_NOTE}</Callout>
          <div className="space-y-6">
            {HIRING_PROFILES.map((p) => (
              <div key={p.role} className="rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-semibold">{p.role}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{p.fit}</p>
                <div className="mt-2">
                  <List title="O que buscar na entrevista" items={p.interview} />
                </div>
                {p.redFlags.length > 0 && (
                  <div className="mt-2">
                    <List title="Red flags definitivos" items={p.redFlags} />
                  </div>
                )}
                {p.minExperience && (
                  <p className="mt-2 text-xs italic" style={{ color: "var(--text-muted)" }}>
                    Experiência mínima recomendada: {p.minExperience}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6.3 */}
        <section id="m6-sec-3" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            6.3 — Plano de Carreira Comercial
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            A Omni investe em crescimento de carreira do time de pré-vendas e vendas. Isso não é
            benefício — é estratégia de retenção e performance. Time que vê futuro na empresa
            performa mais e dura mais.
          </p>
          <p className="text-sm font-medium">Trilha de Pré-vendas (BDR)</p>
          <Table
            headers={["Nível", "Critério de Progressão", "Fixo CLT (ref.)", "Fixo PJ (ref.)", "Meta inicial (SALs)"]}
            rows={BDR_CAREER_LEVELS}
          />
          <Callout tone="blue" title="Importante">{BDR_PROGRESSION_NOTE}</Callout>
          <p className="text-sm font-medium">Próximo degrau após Platinum</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{BDR_NEXT_STEP}</p>
          <List title="Como funciona na prática" items={BDR_PROGRESSION_PROCESS} />
          <p className="text-sm font-medium">Trilha de Vendas (Closer)</p>
          <Table headers={["Nível", "Critério"]} rows={CLOSER_CAREER_LEVELS} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{CLOSER_LEADERSHIP_NOTE}</p>
        </section>

        {/* 6.4 */}
        <section id="m6-sec-4" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            6.4 — Rituais de Gestão Comercial
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Ritual é o que transforma intenção em execução. Sem rituais definidos, cada gestor
            opera com sua própria cadência — e o time perde referência. Os rituais abaixo são
            obrigatórios para a operação comercial da Omni.
          </p>
          <div className="space-y-4">
            {RITUALS.map((r) => (
              <div key={r.title} className="rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{r.cadence}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{r.audience}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
                  {r.agenda.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs font-medium" style={{ color: "var(--accent)" }}>
                  Regra de ouro: {r.goldenRule}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6.5 */}
        <section id="m6-sec-5" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            6.5 — Como Estruturar Metas e Comissionamento
          </h2>
          <p className="text-sm font-medium">Princípios de Remuneração Variável na Omni</p>
          <div className="space-y-3">
            {COMP_PRINCIPLES.map((p) => (
              <div key={p.title}>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{p.text}</p>
              </div>
            ))}
          </div>
          <p className="text-sm font-medium">Estrutura de Metas por Função</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            <strong>BDR:</strong> {BDR_GOAL_NOTE}
          </p>
          <p className="text-sm font-medium">Closer — Estrutura de Faixas de Performance</p>
          <Table headers={["Faixa", "% da Meta", "Multiplicador", "Lógica"]} rows={CLOSER_PERFORMANCE_TIERS} />
          <List title="CS / Implantação — remuneração variável atrelada a" items={CS_VARIABLE_METRICS} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            <strong>Gestor Comercial:</strong> {MANAGER_COMP_NOTE}
          </p>
          <List title="Regras de Ouro do Comissionamento" items={COMP_GOLDEN_RULES} />
        </section>

        {/* 6.6 */}
        <section id="m6-sec-6" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            6.6 — Onboarding de Novos Vendedores (Ramp-up)
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{RAMPUP_INTRO}</p>

          <p className="text-sm font-medium">Ramp-up BDR — 30 dias</p>
          <p className="text-sm font-medium">Semana 1 — Imersão (não discar ainda)</p>
          <Table headers={["Dia", "Atividade"]} rows={BDR_RAMPUP_WEEK1} />
          <Callout tone="blue" title="Como usar a Pipelovers nessa semana">{BDR_RAMPUP_WEEK1_PIPELOVERS}</Callout>
          <p className="text-sm font-medium">Semana 2 — Shadow e Roleplay</p>
          <Table headers={["Atividade", "Detalhe"]} rows={BDR_RAMPUP_WEEK2} />
          <p className="text-sm font-medium">Semana 3 — Operação com Suporte (50% da meta)</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{BDR_RAMPUP_WEEK3}</p>
          <p className="text-sm font-medium">Semana 4 — Operação Independente (75% da meta)</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{BDR_RAMPUP_WEEK4}</p>
          <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>{BDR_RAMPUP_AFTER}</p>

          <p className="text-sm font-medium">Ramp-up Closer — 45 dias</p>
          <p className="text-sm font-medium">Semana 1–2 — Imersão Profunda</p>
          <Table headers={["Atividade", "Detalhe"]} rows={CLOSER_RAMPUP_WEEK1_2} />
          <p className="text-sm font-medium">Semana 3–4 — Co-condução</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{CLOSER_RAMPUP_WEEK3_4}</p>
          <p className="text-sm font-medium">Semana 5–6 — Operação Independente (Meta reduzida)</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{CLOSER_RAMPUP_WEEK5_6}</p>
          <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>{CLOSER_RAMPUP_AFTER}</p>
          <Callout tone="blue" title="Como usar o G4 Skills no ramp-up dos Closers">{CLOSER_RAMPUP_G4}</Callout>
        </section>

        {/* 6.7 */}
        <section id="m6-sec-7" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            6.7 — Ferramentas por Função
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            A Omni já opera com um ecossistema de ferramentas consolidado. Esta seção formaliza
            quem usa o quê e para quê — evitando que ferramenta vire ornamento.
          </p>
          <p className="text-sm font-medium">Stack Obrigatório por Função</p>
          <Table headers={["Ferramenta", "BDR", "Closer", "CS / Tatuí", "Gestor"]} rows={TOOL_STACK} />

          <p className="text-sm font-medium">Pipelovers — Universidade Corporativa de Vendas B2B</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            A maior plataforma de desenvolvimento para times de vendas B2B do Brasil. A Omni usa
            como ferramenta de desenvolvimento contínuo para BDRs e Closers.
          </p>
          <List title="Como funciona na prática" items={PIPELOVERS_PRACTICE} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            <strong>Como integrar ao dia a dia:</strong> {PIPELOVERS_ROUTINE}
          </p>

          <p className="text-sm font-medium">G4 Skills — Plataforma de Desenvolvimento Corporativo</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Plataforma de desenvolvimento contínuo para todo o time comercial da Omni — com foco
            especial em Closers e Gestores.
          </p>
          <List title="Como funciona na prática" items={G4_SKILLS_PRACTICE} />

          <p className="text-sm font-medium">Como as duas ferramentas se complementam</p>
          <Table headers={["Pipelovers", "G4 Skills"]} rows={PIPELOVERS_VS_G4} />
        </section>

        {/* 6.8 */}
        <section id="m6-sec-8" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            6.8 — Reconhecimento e Cultura de Performance
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{RECOGNITION_INTRO}</p>
          <p className="text-sm font-medium">Mecanismos de Reconhecimento na Omni</p>
          <div className="space-y-3">
            {RECOGNITION_MECHANISMS.map((m) => (
              <div key={m.title}>
                <p className="text-sm font-medium">{m.title}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{m.text}</p>
              </div>
            ))}
          </div>
          <p className="text-sm font-medium">O que Evitar na Gestão de Performance</p>
          <div className="space-y-3">
            {PERFORMANCE_AVOID.map((m) => (
              <div key={m.title}>
                <p className="text-sm font-medium">{m.title}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{m.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6.9 */}
        <section id="m6-sec-9" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            6.9 — Checklist de Implementação — Para o Gestor
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <ChecklistBlock title="Setup inicial (fazer uma vez antes de ativar o playbook)" items={CHECKLIST_SETUP_INICIAL} />
            <ChecklistBlock title="Onboarding de novo colaborador (checklist por contratação)" items={CHECKLIST_ONBOARDING_COLABORADOR} />
            <ChecklistBlock title="Rituais (checar mensalmente)" items={CHECKLIST_RITUAIS_MENSAL} />
            <ChecklistBlock title="Cultura (indicadores de saúde)" items={CHECKLIST_CULTURA_SAUDE} />
          </div>
        </section>

        {/* 6.10 */}
        <section id="m6-sec-10" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            6.10 — Pontos de Atenção
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Temas identificados durante o desenvolvimento deste módulo que merecem
            endereçamento antes ou logo após a ativação do playbook:
          </p>
          <div className="space-y-2">
            {ATTENTION_M6.map((item, i) => (
              <Callout key={i} tone="gray">
                {item}
              </Callout>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
