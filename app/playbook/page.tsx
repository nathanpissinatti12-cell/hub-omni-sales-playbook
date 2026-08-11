const PRODUCT = {
  pitch:
    "Plataforma de automação de atendimento multicanal com IA para WhatsApp Business API: construtor visual de fluxos sem código, chatbot com GPT, gestão de filas por setor, campanhas em massa e transferência inteligente para humanos.",
  explainer:
    "Em resumo: o TakeFlow tira o atendimento do WhatsApp da mão dos atendentes para tarefas repetitivas (triagem, dúvidas frequentes, agendamento) e só leva para um humano quando realmente precisa. O vendedor não está vendendo \"um chatbot\" — está vendendo tempo do time e velocidade de resposta para o cliente do prospect.",
  proof: [
    { label: "Conversão em vendas", value: "+40%", why: "Resposta mais rápida e sem furos de atendimento (noite, fim de semana, pico de demanda) significa menos lead esfriando." },
    { label: "Tempo de espera no suporte", value: "-60%", why: "O bot resolve o que é repetitivo (status de pedido, dúvida de horário, etc.) sem fila humana." },
    { label: "Visibilidade para gestores", value: "100%", why: "Todo atendimento fica registrado e mensurável no painel — hoje isso normalmente é invisível quando o atendimento é manual." },
  ],
  differentiators: [
    {
      title: "Sem taxa por mensagem enviada pela plataforma",
      detail: "O prospect paga a plataforma, não paga de novo por volume de mensagem do TakeFlow (a cobrança da Meta é separada — ver seção de urgência abaixo). Isso remove o medo de \"quanto mais eu automatizar, mais caro fica\".",
    },
    {
      title: "Suporte dedicado via WhatsApp",
      detail: "Não é um sistema de ticket genérico onde o cliente some por dias. Isso importa principalmente para quem já teve má experiência com outras ferramentas de automação.",
    },
    {
      title: "Venda consultiva: diagnóstico → desenho do fluxo → implantação acompanhada",
      detail: "Não vendemos uma licença de software solta — vendemos um processo com acompanhamento. Isso é argumento contra concorrentes \"self-service\" onde o cliente compra e fica sozinho para configurar.",
    },
    {
      title: "Interface 100% visual, sem código",
      detail: "Resolve a objeção mais comum de quem não tem time de TI: \"vou precisar contratar alguém para mexer nisso?\" — a resposta é não.",
    },
    {
      title: "Integrações: N8N, webhooks, OpenAI, bancos de dados",
      detail: "Relevante para prospects com CRM/ERP já em uso — mostra que o TakeFlow não fica isolado, ele conversa com o resto da operação do cliente.",
    },
  ],
};

// Passo a passo público em web.takeflow.com.br (seção "Como Funciona") — use
// para explicar ao prospect o que acontece depois da assinatura, sem
// prometer prazo específico (não há prazo publicado).
const IMPLEMENTATION_STEPS = [
  { title: "Conecte seus canais", detail: "Adicione os números de WhatsApp via QR Code ou API oficial." },
  { title: "Configure setores", detail: "Organize a equipe em departamentos com horários de atendimento." },
  { title: "Crie seus fluxos", detail: "Use o editor visual drag-and-drop com os 30+ nós disponíveis." },
  { title: "Escale seu atendimento", detail: "Acompanhe métricas em tempo real e ajuste o fluxo conforme o volume cresce." },
];

// O site não publica tabela de preço — a frase oficial é usada de propósito
// aqui para o vendedor citar com segurança em vez de improvisar.
const PRICING_MODEL = {
  quote: "“Seu plano sai do seu processo, não de uma tabela.”",
  explainer:
    "O TakeFlow não vende por plano fixo. O preço é definido depois do Diagnóstico, com base no fluxo desenhado e no escopo de implantação. Nunca estime valor antes do diagnóstico — a chamada correta é “falar com um especialista”.",
};

const NO_PUBLIC_PROOF_WARNING =
  "O site não divulga nomes de clientes, estudos de caso com números específicos, nem selo oficial de parceria Meta/WhatsApp — apenas a integração com a API oficial. Não afirme ter certificação oficial da Meta nem cite cliente específico sem confirmar antes com o time de marketing/comercial.";

const SEGMENTS = [
  {
    name: "Serviços profissionais",
    examples: "Clínicas, consultórios, escritórios de advocacia",
    pain: "Recepção sobrecarregada com agendamento e dúvidas repetitivas",
    approach: "Pergunte quantas ligações/mensagens por dia são só para marcar, remarcar ou confirmar horário — geralmente é a maior fatia do volume e o caso de uso mais fácil de fechar.",
  },
  {
    name: "Varejo / e-commerce",
    examples: "Lojas online, marketplaces",
    pain: "Alto volume de \"cadê meu pedido\" e suporte pós-venda consumindo o time",
    approach: "Peça o número de pedidos/mês e quantos desses geram mensagem de acompanhamento — o ROI aqui é fácil de visualizar em número de atendimentos evitados.",
  },
  {
    name: "Educação",
    examples: "Escolas, cursos",
    pain: "Comunicados e captação de matrícula manuais e demorados",
    approach: "Pergunte sobre picos sazonais (matrícula, período de provas) — são momentos em que o atendimento manual quebra e a automação mostra valor imediato.",
  },
  {
    name: "Financeiro",
    examples: "Contabilidades, corretoras de seguro, fintechs",
    pain: "Atendimento sensível a prazo e compliance, precisa de rastreabilidade",
    approach: "Reforce que todo atendimento fica registrado no painel — para esse segmento, rastreabilidade pode pesar tanto quanto velocidade.",
  },
  {
    name: "Hospedagem",
    examples: "Hotéis, pousadas",
    pain: "Reservas e dúvidas fora do horário comercial sem cobertura 24h",
    approach: "O gancho aqui é cobertura 24h sem precisar de plantão humano — pergunte quantas reservas hoje se perdem por demora fora do horário comercial.",
  },
  {
    name: "Imobiliário",
    examples: "Imobiliárias, corretores",
    pain: "Leads esfriam por demora na primeira resposta",
    approach: "Nesse segmento velocidade de resposta é tudo — pergunte qual o tempo médio hoje entre o lead chegar e alguém responder.",
  },
];

const URGENCY = {
  title: "Gatilho de urgência: nova cobrança da Meta (out/2026)",
  body:
    "A partir de outubro de 2026, a Meta passa a cobrar por mensagem em conversas de suporte no WhatsApp Business API — hoje isso é gratuito. Mensagem recebida do cliente continua sem custo; o que passa a ser cobrado são as mensagens enviadas pela empresa (utilidade: R$ 0,04/msg · marketing: R$ 0,32/msg).",
  explainer:
    "Ou seja: hoje, um negócio pode trocar 20 mensagens de suporte com um cliente no WhatsApp de graça. A partir de outubro de 2026, cada mensagem enviada pela empresa nessa conversa passa a ter custo. Quanto mais mensagens o atendimento manual troca para resolver uma dúvida simples, maior o custo mensal que esse prospect vai começar a pagar — mesmo sem mudar nada no processo dele.",
  angle:
    "Todo prospect que usa WhatsApp para suporte vai ter um aumento de custo estrutural em poucos meses. Automatizar e reduzir mensagens por atendimento deixa de ser 'otimização' e passa a ser economia direta. Use a calculadora do site (/calculadora) na reunião de diagnóstico para dimensionar o impacto financeiro do prospect e ancorar a proposta.",
};

const STAGES = [
  {
    name: "Lead",
    goal: "Capturar interesse inicial",
    criteria: "Contato identificado (empresa, segmento, canal de origem, volume estimado de atendimentos/mês)",
    action: "Qualificar em até 24h via ligação ou WhatsApp",
    why: "É a porta de entrada — o objetivo não é vender aqui, é confirmar que vale a pena investir tempo qualificando esse contato.",
  },
  {
    name: "Qualificação",
    goal: "Confirmar fit e dor real (MQL → SQL)",
    criteria:
      "Usa ou pretende usar WhatsApp Business API, tem volume de atendimento relevante, decisor identificado",
    action: "Agendar reunião de diagnóstico do processo de atendimento",
    why: "Evita gastar uma reunião de diagnóstico inteira com quem não tem volume suficiente para justificar automação, ou que não fala com quem decide.",
  },
  {
    name: "Diagnóstico",
    goal: "Mapear o processo atual e a dor",
    criteria:
      "Fluxo de atendimento atual mapeado (etapas, volume, gargalos) e impacto da cobrança Meta out/2026 dimensionado",
    action: "Rodar a calculadora de custo e desenhar a proposta de fluxo no TakeFlow",
    why: "É aqui que a venda deixa de ser genérica: em vez de \"a plataforma faz X\", você mostra exatamente onde o fluxo do prospect vai economizar tempo e dinheiro.",
  },
  {
    name: "Proposta",
    goal: "Apresentar o desenho do fluxo e o escopo",
    criteria: "Proposta com escopo, prazo de implantação e preço enviada e confirmada como recebida",
    action: "Follow-up em 3 dias úteis",
    why: "Uma proposta só vale alguma coisa se você confirmar que chegou e foi entendida — não deixe no \"vou aguardar retorno\".",
  },
  {
    name: "Negociação",
    goal: "Alinhar condições finais",
    criteria: "Objeções principais mapeadas e endereçadas (ver seção de objeções)",
    action: "Confirmar decisão em até 7 dias",
    why: "Objeção não respondida vira \"vou pensar\" que nunca mais responde. Trate cada objeção como uma pergunta que precisa de resposta clara, não como resistência a driblar.",
  },
  {
    name: "Fechamento",
    goal: "Converter em cliente e iniciar implantação",
    criteria: "Contrato assinado ou oportunidade perdida com motivo registrado",
    action: "Passar para implantação acompanhada (se ganho) ou registrar motivo de perda",
    why: "Registrar o motivo de perda não é burocracia — é o que permite identificar padrões (preço, timing, feature faltando) e ajustar a abordagem nas próximas oportunidades.",
  },
];

const QUALIFYING_QUESTIONS = [
  {
    q: "Vocês já usam o WhatsApp Business API ou ainda estão no app comum?",
    why: "Define se o prospect já está no ecossistema certo ou se vai precisar migrar antes — muda o prazo e o escopo do projeto.",
  },
  {
    q: "Quantos atendimentos por dia, em média, o time faz hoje?",
    why: "É o número que você vai usar depois na calculadora de custo da Meta e para dimensionar o ROI da automação.",
  },
  {
    q: "Quantas mensagens em média são trocadas por atendimento?",
    why: "Atendimento manual costuma gastar mais mensagens que um fluxo automatizado — essa é a base de comparação para mostrar economia.",
  },
  {
    q: "O atendimento é feito por quantas pessoas / setores hoje?",
    why: "Ajuda a entender a complexidade do fluxo (quantas filas/setores o TakeFlow vai precisar rotear) e o tamanho do time impactado.",
  },
  {
    q: "Vocês já perderam lead ou cliente por demora na primeira resposta?",
    why: "Transforma a dor de \"acho que demoramos\" em um evento concreto que você pode usar na proposta.",
  },
  {
    q: "Existe horário sem cobertura (noite, fim de semana) em que perdem contato?",
    why: "Cobertura 24h é um dos ganhos mais fáceis de vender — descobre se esse gancho se aplica ao prospect.",
  },
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
        className="space-y-2 rounded-lg border p-4 text-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="font-semibold">Como usar este playbook</h2>
        <p style={{ color: "var(--text-muted)" }}>
          As seções seguem a ordem de uma venda de verdade: primeiro você entende o produto,
          depois identifica se o prospect é do perfil certo (ICP), acompanha o funil etapa por
          etapa, usa as perguntas de qualificação para guiar a conversa de diagnóstico, e recorre
          à tabela de objeções quando o prospect trouxer dúvidas na negociação. Cada bloco explica
          não só <em>o quê</em> fazer, mas <em>por quê</em> — para você adaptar a conversa em vez
          de decorar um script.
        </p>
      </section>

      <section
        className="space-y-4 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="text-lg font-semibold">O produto</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{PRODUCT.pitch}</p>
        <p className="text-sm">{PRODUCT.explainer}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRODUCT.proof.map((p) => (
            <div key={p.label}>
              <p className="text-xl font-semibold" style={{ color: "var(--accent)" }}>
                {p.value}
              </p>
              <p className="text-xs font-medium">{p.label}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{p.why}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-medium">Diferenciais — e por que cada um importa na venda</p>
          <dl className="mt-2 space-y-3">
            {PRODUCT.differentiators.map((d) => (
              <div key={d.title}>
                <dt className="text-sm font-medium">{d.title}</dt>
                <dd className="text-sm" style={{ color: "var(--text-muted)" }}>{d.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Como funciona a implantação</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          O que acontece depois que o contrato é assinado — use para responder "e depois que eu
          fechar, como funciona?" sem prometer prazo específico (o site não publica prazo).
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IMPLEMENTATION_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ background: "var(--accent)" }}
              >
                {i + 1}
              </span>
              <h3 className="mt-2 font-medium">{step.title}</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="space-y-2 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="text-lg font-semibold">Como funciona o preço</h2>
        <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>{PRICING_MODEL.quote}</p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{PRICING_MODEL.explainer}</p>
      </section>

      <section
        className="space-y-2 rounded-lg border p-4 text-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="font-semibold">Atenção ao usar prova social</h2>
        <p style={{ color: "var(--text-muted)" }}>{NO_PUBLIC_PROOF_WARNING}</p>
      </section>

      <section
        className="space-y-3 rounded-lg border p-4"
        style={{ borderColor: "var(--accent)", background: "var(--surface)" }}
      >
        <h2 className="text-lg font-semibold">{URGENCY.title}</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{URGENCY.body}</p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{URGENCY.explainer}</p>
        <p className="text-sm font-medium">{URGENCY.angle}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Segmentos-alvo (ICP)</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          ICP (Ideal Customer Profile) é o perfil de cliente que mais se beneficia do produto e
          fecha mais rápido. Não é uma lista fechada — é um guia para priorizar onde investir
          tempo de prospecção primeiro. Cada segmento abaixo tem uma dor específica; use-a para
          personalizar a abordagem em vez de repetir o mesmo discurso genérico.
        </p>
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
              <p className="mt-2 text-sm">
                <span className="font-medium">Como abordar: </span>
                <span style={{ color: "var(--text-muted)" }}>{seg.approach}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Etapas do funil</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          O funil é a sequência de etapas que uma oportunidade percorre do primeiro contato até
          o fechamento. Cada etapa tem um objetivo claro e um critério de avanço — não pule etapa
          só para "andar mais rápido": pular qualificação ou diagnóstico costuma gerar propostas
          genéricas que não fecham.
        </p>
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
                <div>
                  <dt className="font-medium">Por que essa etapa existe</dt>
                  <dd style={{ color: "var(--text-muted)" }}>{stage.why}</dd>
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
          urgência (inclusive para alimentar a calculadora de custo da Meta). Cada pergunta
          existe por um motivo — veja abaixo o que fazer com a resposta.
        </p>
        <div className="space-y-3">
          {QUALIFYING_QUESTIONS.map((item) => (
            <div key={item.q} className="text-sm">
              <p className="font-medium">{item.q}</p>
              <p style={{ color: "var(--text-muted)" }}>{item.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Objeções frequentes</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Trate objeção como pergunta, não como rejeição: confirme que entendeu a dúvida,
          responda com o fato (não invente o que não sabe) e confirme se isso resolveu antes
          de seguir para o próximo ponto.
        </p>
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
