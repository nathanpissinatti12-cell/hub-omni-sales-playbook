import { HashSection } from "@/components/playbook/HashSection";
import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { PlaybookModuleProvider } from "@/components/playbook/PlaybookModuleContext";
import { getSiteSession } from "@/lib/getSiteSession";
import { SectionNav } from "@/components/playbook/SectionNav";
import { Table } from "@/components/playbook/Table";
import { Callout } from "@/components/playbook/Callout";
import { ObjectionAccordion } from "@/components/playbook/ObjectionAccordion";
import {
  CLOSER_BEHAVIORAL,
  CLOSER_TECHNICAL,
  CLOSER_NOT,
  SALES_CYCLE,
  HUBSPOT_FIELDS,
  ACTIVITY_TYPES,
  MEETING_LOG_FLOW,
  DIAGNOSTIC_PRE_CHECKLIST,
  DIAGNOSTIC_BLOCKS,
  DIAGNOSTIC_CLOSING_PROTOCOL,
  SIGNALS,
  BETWEEN_MEETINGS_CHECKLIST,
  DEMO_RESULT_METRICS,
  PROOF_CASES,
  MENTAL_TRIGGERS,
  NEGOTIATION_OBJECTIONS,
  CLOSER_OBJECTION_SCRIPTS,
  CLOSER_HUBSPOT_RESPONSIBILITIES,
  CLOSER_DASHBOARDS,
  CLOSER_KPIS,
  CHECKLIST_M3_PROCESSO,
  CHECKLIST_M3_HUBSPOT,
  CHECKLIST_M3_NEGOCIACAO,
  CHECKLIST_M3_GESTAO,
  MODULE_3_SECTIONS,
} from "@/lib/playbookModule3";

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

function SignalList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function Modulo3Page() {
  const session = await getSiteSession();
  return (
    <>
      <PlaybookSidebar activeModuleId={3} accessLevel={session?.accessLevel ?? ""} />

      <PlaybookModuleProvider moduleId={3}>
      <div className="playbook-content min-w-0 flex-1 space-y-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Playbook de Vendas — Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Módulo 3 — Vendas / Closers</h1>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Versão 1.0 — Maio 2026</p>
        </div>

        {/* 3.1 */}
        <HashSection id="m3-sec-1" className="scroll-mt-20 space-y-4" defaultOpen>
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            3.1 — Perfil Ideal do Closer da Omni
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            O closer da Omni não é um vendedor de produto. É um consultor de comunicação
            corporativa que usa a venda como consequência de um diagnóstico bem feito. O perfil
            exigido é diferente do vendedor transacional tradicional — aqui, escuta ativa,
            raciocínio analítico e capacidade de construir business case em tempo real são tão
            importantes quanto técnica de fechamento.
          </p>
          <SignalList title="Características comportamentais obrigatórias" items={CLOSER_BEHAVIORAL} />
          <SignalList title="Características técnicas obrigatórias" items={CLOSER_TECHNICAL} />
          <SignalList title="O que o closer da Omni NÃO é" items={CLOSER_NOT} />
        </HashSection>

        {/* 3.2 */}
        <HashSection id="m3-sec-2" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            3.2 — Estrutura do Ciclo de Vendas da Omni
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            O ciclo de vendas da Omni é estruturado em duas reuniões principais, refletidas
            diretamente no funil do HubSpot (Aquisição de Receita — Sênior):
          </p>
          <Table
            headers={["Etapa", "Funil", "Descrição"]}
            rows={SALES_CYCLE.map((s) => [s.etapa, s.funil, s.descricao])}
          />
        </HashSection>

        {/* 3.3 */}
        <HashSection id="m3-sec-3" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            3.3 — Campos Obrigatórios no HubSpot por Etapa
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            O HubSpot exige preenchimento de campos específicos a cada avanço de etapa. O
            closer não consegue mover o card sem preenchê-los. Esses campos são o espelho do
            processo — se estão vazios, a venda não foi conduzida corretamente.
          </p>
          {HUBSPOT_FIELDS.map((group) => (
            <div key={group.transition} className="space-y-1">
              <p className="text-sm font-medium">{group.transition}</p>
              <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
                {group.fields.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </HashSection>

        {/* 3.4 */}
        <HashSection id="m3-sec-4" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            3.4 — Registro de Atividades no HubSpot
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Todo ponto de contato com o cliente deve ser registrado como atividade dentro do
            card do negócio no HubSpot. Sem exceção.
          </p>
          <SignalList title="O que registrar" items={ACTIVITY_TYPES} />
          <div>
            <p className="text-sm font-medium">Fluxo de registro de reuniões</p>
            <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              {MEETING_LOG_FLOW.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ol>
          </div>
          <Callout tone="blue" title="Ponto de atenção operacional">
            A adesão ao preenchimento do CRM é a principal dificuldade do time. Mesmo com
            campos obrigatórios por etapa, o registro de atividades livres (ligações,
            mensagens, notas) depende de disciplina do vendedor e cobrança ativa do gestor.
            Isso deve ser endereçado nos rituais de gestão e no onboarding de novos closers.
          </Callout>
        </HashSection>

        {/* 3.5 */}
        <HashSection id="m3-sec-5" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            3.5 — Reunião 1 — Diagnóstico (O &quot;Raio-X&quot;)
          </h2>

          <div className="space-y-2">
            <h3 className="font-medium">3.5.1 — Visão geral</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              O Diagnóstico é a reunião mais importante do ciclo de vendas da Omni. É aqui que
              se define se o negócio vai andar — e em qual direção. Um Diagnóstico mal feito
              gera uma Demonstração genérica, uma proposta sem aderência e um cliente que some.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              <li><span className="font-medium" style={{ color: "var(--text)" }}>Duração:</span> 45 a 60 minutos</li>
              <li><span className="font-medium" style={{ color: "var(--text)" }}>Objetivo:</span> Mapear com profundidade a operação do cliente para que a Demonstração de Solução seja precisa, dimensionada e materializada em ROI</li>
              <li><span className="font-medium" style={{ color: "var(--text)" }}>Resultado esperado:</span> Agendamento da 2ª reunião com os decisores corretos presentes</li>
            </ul>
            <p className="text-sm font-medium">Checklist obrigatório — antes de entrar na reunião</p>
            <ul className="space-y-1 text-sm">
              {DIAGNOSTIC_PRE_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden>☐</span>
                  <span style={{ color: "var(--text-muted)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">3.5.2 — Estrutura da reunião de Diagnóstico</h3>
            <p className="text-sm font-medium">Abertura (5 minutos)</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Rapport genuíno antes de qualquer protocolo. 2 a 3 minutos de conversa pessoal
              real — feriado, cidade, semana, contexto do cliente. Não pule essa etapa:
              conforme identificado nas transcrições de abril, esse momento define 50% da
              abertura do cliente para o restante da reunião.
            </p>
            <Callout tone="gray" title="Script de abertura da reunião">
              &quot;Essa primeira conversa é o nosso Raio-X — eu preciso entender a fundo como vocês
              operam hoje, quais são os gargalos, o que já foi tentado. A partir disso, minha
              equipe vai desenhar uma solução personalizada pra vocês, e na próxima reunião eu
              te apresento isso funcionando ao vivo, já com os números de vocês. Faz sentido?&quot;
            </Callout>

            {DIAGNOSTIC_BLOCKS.map((block) => (
              <div key={block.title} className="space-y-2 rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                  {block.title} <span className="font-normal" style={{ color: "var(--text-muted)" }}>({block.duration})</span>
                </p>
                {block.intro && <p className="text-sm" style={{ color: "var(--text-muted)" }}>{block.intro}</p>}
                <ol className="space-y-2 pl-5 text-sm" style={{ listStyleType: "decimal" }}>
                  {block.questions.map((qq) => (
                    <li key={qq.n}>
                      <span className="font-medium">Pergunta {qq.n}:</span> {qq.q}
                      {qq.notes && (
                        <ul className="mt-1 space-y-0.5 pl-4 text-xs italic" style={{ color: "var(--text-muted)" }}>
                          {qq.notes.map((n) => (
                            <li key={n}>{n}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}

            <p className="text-sm font-medium">Microfechamento de evolução — script padrão de encerramento</p>
            <Callout tone="gray">
              &quot;Perfeito. Agora a lição de casa fica comigo. Vou levar seu caso para a equipe,
              vamos desenhar o processo personalizado para resolver os pontos que mapeamos, e na
              próxima reunião eu te apresento o desenho da solução funcionando ao vivo, com os
              seus números. Você prefere segunda ou quarta da semana que vem?&quot;
            </Callout>
            <p className="text-sm font-medium">Protocolo de confirmação</p>
            <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              {DIAGNOSTIC_CLOSING_PROTOCOL.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">3.5.3 — Sinais a mapear durante o Diagnóstico</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <SignalList title="Sinais de cross-sell Onvox" items={SIGNALS.onvox} />
              <SignalList title="Sinais de cross-sell Evolue AI" items={SIGNALS.evolueAi} />
              <SignalList title="Sinais de pacote maior (N1 200+ ou N2)" items={SIGNALS.bigPackage} />
              <SignalList title="Sinais de risco — ajustar expectativa do cliente" items={SIGNALS.risk} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">3.5.4 — Entre o Diagnóstico e a Demonstração</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Após o Diagnóstico, antes da Demonstração (tipicamente 3 a 7 dias), o closer
              prepara:
            </p>
            <ul className="space-y-1 text-sm">
              {BETWEEN_MEETINGS_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden>☐</span>
                  <span style={{ color: "var(--text-muted)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </HashSection>

        {/* 3.6 */}
        <HashSection id="m3-sec-6" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            3.6 — Reunião 2 — Demonstração da Solução
          </h2>
          <div className="space-y-2">
            <h3 className="font-medium">3.6.1 — Visão geral</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              A Demonstração não é uma apresentação de produto. É a entrega de um diagnóstico
              estruturado em forma de solução. O cliente deve sair dessa reunião sentindo que a
              proposta foi feita para ele — não para qualquer empresa do segmento.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              <li><span className="font-medium" style={{ color: "var(--text)" }}>Duração:</span> 45 a 60 minutos</li>
              <li><span className="font-medium" style={{ color: "var(--text)" }}>Objetivo:</span> Apresentar solução personalizada com ROI materializado, avançar para negociação ou fechamento</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">3.6.2 — Estrutura da Demonstração</h3>
            <p className="text-sm font-medium">Abertura (3 a 5 minutos)</p>
            <Callout tone="gray">
              &quot;Na nossa última conversa, vocês me contaram que [dor 1], [dor 2] e [dor 3].
              Trouxe hoje uma solução desenhada especificamente para resolver esses pontos. Vou
              mostrar funcionando ao vivo, com os números de vocês.&quot;
            </Callout>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Confirmar que os decisores corretos estão presentes. Se o decisor adicional não
              veio, avaliar se faz sentido prosseguir ou remarcar.
            </p>

            <p className="text-sm font-medium">Apresentação da Solução (20 a 25 minutos)</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Estruturar a apresentação na ordem das dores — não na ordem das funcionalidades
              do produto. Modelo de apresentação por dor: 1) resgatar a dor específica que o
              cliente verbalizou; 2) mostrar como a solução resolve aquela dor específica (demo
              ao vivo quando possível); 3) materializar o impacto em números (ROI calculado com
              os dados do cliente).
            </p>

            <p className="text-sm font-medium">Métricas de expectativa de resultado a usar na Demonstração</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DEMO_RESULT_METRICS.map((m) => (
                <div key={m.label}>
                  <p className="text-lg font-semibold" style={{ color: "var(--accent)" }}>{m.value}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.label}</p>
                </div>
              ))}
            </div>

            <Callout tone="blue" title="Exemplo de materialização de ROI (modelo Farma Ponte)">
              &quot;Se cada loja perde uma venda de R$ 20 por falta de atendimento, e vocês têm 119
              lojas, isso representa R$ 71.400 por mês em receita que some sem que ninguém
              perceba.&quot; Adaptar o cálculo para a realidade de cada cliente com os dados
              coletados no Diagnóstico.
            </Callout>

            <p className="text-sm font-medium">Apresentação de provas sociais (5 minutos)</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Usar cases do mesmo segmento ou porte. Cases mais utilizados e validados:</p>
            <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              {PROOF_CASES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <p className="text-sm font-medium">Microfechamento da Demonstração (5 a 8 minutos)</p>
            <Callout tone="gray">
              &quot;Com base em tudo que apresentei, isso resolve o que vocês precisam? Faz sentido
              evoluirmos — nem que seja com uma degustação para vocês validarem na prática antes
              de qualquer decisão maior?&quot;
            </Callout>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Se resposta for &quot;depende&quot; ou &quot;vou avaliar&quot;:</p>
            <Callout tone="gray">&quot;Do que depende? O que falta para fazer sentido?&quot;</Callout>
          </div>
        </HashSection>

        {/* 3.7 */}
        <HashSection id="m3-sec-7" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            3.7 — Técnicas de Negociação e Fechamento
          </h2>

          <div className="space-y-2">
            <h3 className="font-medium">3.7.1 — Princípio central</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              O closer da Omni nunca termina uma interação sem um próximo passo concreto e
              datado. Não existe &quot;vou mandar a proposta e aguardo seu retorno&quot;. Existe: &quot;Vou
              mandar a proposta e na quinta às 14h a gente tem 20 minutos para alinhar o que
              ficou de dúvida — funciona?&quot;
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">3.7.2 — Sempre combinar evolução</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Após cada interação, o próximo passo deve ser: específico (o que vai acontecer), datado (quando vai acontecer), com responsável definido (quem vai fazer).</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Se há outros decisores envolvidos (sócio, diretor, TI, financeiro): mapear quem
              são ainda no Diagnóstico, combinar quando e como esse contato será feito, e sempre
              que possível a Omni assume a frente e agenda diretamente a reunião com o decisor.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">3.7.3 — Ancoragem de preço</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
              <li>Apresentar valor de tabela (valor âncora) antes do valor negociado</li>
              <li>Trabalhar desconto como concessão deliberada — não como ponto de partida</li>
              <li>Flexibilização de implantação (parcelamento ou isenção) usada como ferramenta de fechamento em casos específicos</li>
              <li>Isenção de implantação pode ser condicionada a prazo: &quot;Se fecharmos até sexta, consigo segurar a isenção de implantação&quot;</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">3.7.4 — Gatilhos mentais</h3>
            <dl className="space-y-2">
              {MENTAL_TRIGGERS.map((t) => (
                <div key={t.title} className="text-sm">
                  <dt className="font-medium">{t.title}</dt>
                  <dd style={{ color: "var(--text-muted)" }}>{t.detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">3.7.5 — Contorno de objeções mais comuns</h3>
            <div className="space-y-3">
              {NEGOTIATION_OBJECTIONS.map((o) => (
                <ObjectionAccordion key={o.question} question={o.question} answer={o.answer} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">3.7.6 — 7 Objeções do Closer — Scripts</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Objeções de nível executivo, próprias da reunião de negociação — distintas das do
              Módulo 2 (cold call BDR). Estrutura padrão de resposta: reconheça a preocupação
              (sem concordar) → reframe (mude o ângulo da discussão) → prova social com dado
              concreto → próxima etapa clara e de baixo risco.
            </p>
            <div className="space-y-3">
              {CLOSER_OBJECTION_SCRIPTS.map((o) => (
                <ObjectionAccordion key={o.tag} tag={o.tag} question={o.question} answer={o.answer} />
              ))}
            </div>
          </div>
        </HashSection>

        {/* 3.8 */}
        <HashSection id="m3-sec-8" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            3.8 — Gestão de Pipeline e CRM
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            O pipeline do HubSpot é o espelho da realidade comercial — não um relatório para o
            gestor. O closer que não atualiza o CRM não tem visibilidade do próprio negócio.
          </p>
          <SignalList title="Responsabilidades do closer no HubSpot" items={CLOSER_HUBSPOT_RESPONSIBILITIES} />
          <SignalList title="Dashboards acompanhados pelo closer e gestor" items={CLOSER_DASHBOARDS} />
        </HashSection>

        {/* 3.9 */}
        <HashSection id="m3-sec-9" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            3.9 — Métricas e KPIs do Closer
          </h2>
          <Table
            headers={["Categoria", "Métrica", "Frequência"]}
            rows={CLOSER_KPIS.map((k) => [k.categoria, k.metrica, k.frequencia])}
          />
        </HashSection>

        {/* Checklist */}
        <HashSection id="m3-sec-10" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            Checklist de Implementação — Módulo 3
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Para o gestor validar se o Módulo 3 está operando corretamente:</p>
          <ChecklistBlock title="Processo" items={CHECKLIST_M3_PROCESSO} />
          <ChecklistBlock title="HubSpot" items={CHECKLIST_M3_HUBSPOT} />
          <ChecklistBlock title="Negociação" items={CHECKLIST_M3_NEGOCIACAO} />
          <ChecklistBlock title="Gestão" items={CHECKLIST_M3_GESTAO} />
        </HashSection>

        <p className="border-t pt-4 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          Omni Assessoria — Playbook de Vendas — Módulo 3 — Vendas / Closers — Versão 1.0
        </p>

        <SectionNav sections={MODULE_3_SECTIONS} />
      </div>
      </PlaybookModuleProvider>
    </>
  );
}
