const PRODUCT = {
  pitch:
    "Plataforma de automação de atendimento multicanal com IA para WhatsApp Business API: construtor visual de fluxos sem código, chatbot com GPT, gestão de filas por setor, campanhas em massa e transferência inteligente para humanos.",
  proof: [
    { label: "Conversão em vendas", value: "+40%" },
    { label: "Tempo de espera no suporte", value: "-60%" },
    { label: "Visibilidade para gestores", value: "100%" },
  ],
  differentiators: [
    "Sem taxa por mensagem enviada pela plataforma",
    "Suporte dedicado via WhatsApp",
    "Venda consultiva: diagnóstico → desenho do fluxo → implantação acompanhada (não é só uma licença de software)",
    "Interface 100% visual, sem código",
    "Integrações: N8N, webhooks, OpenAI, bancos de dados",
  ],
};

const SEGMENTS = [
  {
    name: "Serviços profissionais",
    examples: "Clínicas, consultórios, escritórios de advocacia",
    pain: "Recepção sobrecarregada com agendamento e dúvidas repetitivas",
  },
  {
    name: "Varejo / e-commerce",
    examples: "Lojas online, marketplaces",
    pain: "Alto volume de \"cadê meu pedido\" e suporte pós-venda consumindo o time",
  },
  {
    name: "Educação",
    examples: "Escolas, cursos",
    pain: "Comunicados e captação de matrícula manuais e demorados",
  },
  {
    name: "Financeiro",
    examples: "Contabilidades, corretoras de seguro, fintechs",
    pain: "Atendimento sensível a prazo e compliance, precisa de rastreabilidade",
  },
  {
    name: "Hospedagem",
    examples: "Hotéis, pousadas",
    pain: "Reservas e dúvidas fora do horário comercial sem cobertura 24h",
  },
  {
    name: "Imobiliário",
    examples: "Imobiliárias, corretores",
    pain: "Leads esfriam por demora na primeira resposta",
  },
];

const URGENCY = {
  title: "Gatilho de urgência: nova cobrança da Meta (out/2026)",
  body:
    "A partir de outubro de 2026, a Meta passa a cobrar por mensagem em conversas de suporte no WhatsApp Business API — hoje isso é gratuito. Mensagem recebida do cliente continua sem custo; o que passa a ser cobrado são as mensagens enviadas pela empresa (utilidade: R$ 0,04/msg · marketing: R$ 0,32/msg).",
  angle:
    "Todo prospect que usa WhatsApp para suporte vai ter um aumento de custo estrutural em poucos meses. Automatizar e reduzir mensagens por atendimento deixa de ser 'otimização' e passa a ser economia direta. Use a calculadora do site (/calculadora) na reunião de diagnóstico para dimensionar o impacto financeiro do prospect e ancorar a proposta.",
};

const STAGES = [
  {
    name: "Lead",
    goal: "Capturar interesse inicial",
    criteria: "Contato identificado (empresa, segmento, canal de origem, volume estimado de atendimentos/mês)",
    action: "Qualificar em até 24h via ligação ou WhatsApp",
  },
  {
    name: "Qualificação",
    goal: "Confirmar fit e dor real (MQL → SQL)",
    criteria:
      "Usa ou pretende usar WhatsApp Business API, tem volume de atendimento relevante, decisor identificado",
    action: "Agendar reunião de diagnóstico do processo de atendimento",
  },
  {
    name: "Diagnóstico",
    goal: "Mapear o processo atual e a dor",
    criteria:
      "Fluxo de atendimento atual mapeado (etapas, volume, gargalos) e impacto da cobrança Meta out/2026 dimensionado",
    action: "Rodar a calculadora de custo e desenhar a proposta de fluxo no TakeFlow",
  },
  {
    name: "Proposta",
    goal: "Apresentar o desenho do fluxo e o escopo",
    criteria: "Proposta com escopo, prazo de implantação e preço enviada e confirmada como recebida",
    action: "Follow-up em 3 dias úteis",
  },
  {
    name: "Negociação",
    goal: "Alinhar condições finais",
    criteria: "Objeções principais mapeadas e endereçadas (ver seção de objeções)",
    action: "Confirmar decisão em até 7 dias",
  },
  {
    name: "Fechamento",
    goal: "Converter em cliente e iniciar implantação",
    criteria: "Contrato assinado ou oportunidade perdida com motivo registrado",
    action: "Passar para implantação acompanhada (se ganho) ou registrar motivo de perda",
  },
];

const QUALIFYING_QUESTIONS = [
  "Vocês já usam o WhatsApp Business API ou ainda estão no app comum?",
  "Quantos atendimentos por dia, em média, o time faz hoje?",
  "Quantas mensagens em média são trocadas por atendimento?",
  "O atendimento é feito por quantas pessoas / setores hoje?",
  "Vocês já perderam lead ou cliente por demora na primeira resposta?",
  "Existe horário sem cobertura (noite, fim de semana) em que perdem contato?",
];

const OBJECTIONS = [
  {
    question: "O TakeFlow funciona com o WhatsApp Oficial (Business API)?",
    answer: "Sim, a plataforma opera sobre a API oficial do WhatsApp Business, não o app comum.",
  },
  {
    question: "Preciso de conhecimento técnico para usar?",
    answer: "Não. O construtor de fluxos é 100% visual, sem código, com mais de 30 tipos de nós prontos.",
  },
  {
    question: "Quantos números de WhatsApp posso conectar?",
    answer: "Depende do escopo definido no diagnóstico — confirmar com o time técnico antes de prometer número específico.",
  },
  {
    question: "Como funciona a IA no TakeFlow?",
    answer: "Via nós de IA integrados com GPT dentro do próprio fluxo visual, para responder e qualificar automaticamente.",
  },
  {
    question: "O chatbot consegue transferir para um humano?",
    answer: "Sim — transferência inteligente para agentes por fila/setor quando o fluxo identifica necessidade de atendimento humano.",
  },
  {
    question: "Como funciona o suporte?",
    answer: "Suporte dedicado via WhatsApp, incluído — não é um canal de ticket genérico.",
  },
  {
    question: "Posso integrar com outros sistemas?",
    answer: "Sim, via N8N, webhooks, integração com OpenAI e conexão direta com bancos de dados.",
  },
];

export default function PlaybookPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Playbook de Vendas — TakeFlow</h1>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>
          Processo comercial para vender a plataforma TakeFlow (automação de atendimento
          com IA no WhatsApp): o que dizer, para quem, e como conduzir cada etapa.
        </p>
      </div>

      <section
        className="space-y-4 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="text-lg font-semibold">O produto</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{PRODUCT.pitch}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRODUCT.proof.map((p) => (
            <div key={p.label}>
              <p className="text-xl font-semibold" style={{ color: "var(--accent)" }}>
                {p.value}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.label}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-medium">Diferenciais</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
            {PRODUCT.differentiators.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="space-y-3 rounded-lg border p-4"
        style={{ borderColor: "var(--accent)", background: "var(--surface)" }}
      >
        <h2 className="text-lg font-semibold">{URGENCY.title}</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{URGENCY.body}</p>
        <p className="text-sm font-medium">{URGENCY.angle}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Segmentos-alvo (ICP)</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTS.map((seg) => (
            <div
              key={seg.name}
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <h3 className="font-medium">{seg.name}</h3>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{seg.examples}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Dor: </span>
                <span style={{ color: "var(--text-muted)" }}>{seg.pain}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Etapas do funil</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((stage, i) => (
            <div
              key={stage.name}
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ background: "var(--accent)" }}
                >
                  {i + 1}
                </span>
                <h3 className="font-medium">{stage.name}</h3>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="font-medium">Objetivo</dt>
                  <dd style={{ color: "var(--text-muted)" }}>{stage.goal}</dd>
                </div>
                <div>
                  <dt className="font-medium">Critério de avanço</dt>
                  <dd style={{ color: "var(--text-muted)" }}>{stage.criteria}</dd>
                </div>
                <div>
                  <dt className="font-medium">Próxima ação</dt>
                  <dd style={{ color: "var(--text-muted)" }}>{stage.action}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Perguntas de qualificação</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Usar na etapa de Qualificação e no Diagnóstico para dimensionar volume, dor e
          urgência (inclusive para alimentar a calculadora de custo da Meta).
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
          {QUALIFYING_QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Objeções frequentes</h2>
        <div
          className="overflow-x-auto rounded-lg border"
          style={{ borderColor: "var(--border)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                <th className="px-4 py-2 font-medium">Pergunta / objeção</th>
                <th className="px-4 py-2 font-medium">Resposta</th>
              </tr>
            </thead>
            <tbody>
              {OBJECTIONS.map((o) => (
                <tr key={o.question} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-2 font-medium">{o.question}</td>
                  <td className="px-4 py-2" style={{ color: "var(--text-muted)" }}>{o.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
