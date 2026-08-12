import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { Table } from "@/components/playbook/Table";
import { Callout } from "@/components/playbook/Callout";
import {
  CULTURE_PILLARS,
  COMP_PRINCIPLES,
  CLOSER_PERFORMANCE_TIERS,
  BDR_GOAL_NOTE,
  OTE_FAIXAS,
  CS_VARIABLE_METRICS,
  MANAGER_COMP_NOTE,
  COMP_GOLDEN_RULES,
  TOOL_STACK,
  PIPELOVERS_PRACTICE,
  PIPELOVERS_ROUTINE,
  G4_SKILLS_PRACTICE,
  PIPELOVERS_VS_G4,
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
          <Table
            headers={["Faixa", "% da Meta", "Leads SAL", "Multiplicador", "Bônus Final", "Total (Fixo + Bônus)"]}
            rows={OTE_FAIXAS.map((f) => [f.faixa, f.pct, f.leads, f.mult, f.bonus, f.total])}
          />
          <p className="text-sm font-medium">Closer — Estrutura de Faixas de Performance</p>
          <Table headers={["Faixa", "% da Meta", "Multiplicador", "Lógica"]} rows={CLOSER_PERFORMANCE_TIERS} />
          <List title="CS / Implantação — remuneração variável atrelada a" items={CS_VARIABLE_METRICS} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            <strong>Gestor Comercial:</strong> {MANAGER_COMP_NOTE}
          </p>
          <List title="Regras de Ouro do Comissionamento" items={COMP_GOLDEN_RULES} />
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
      </div>
    </>
  );
}
