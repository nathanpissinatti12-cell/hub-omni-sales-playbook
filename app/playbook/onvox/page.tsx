const PRODUCT = {
  pitch:
    "PABX em nuvem completo com telefonia omnichannel para call centers e centrais de atendimento: ramais ilimitados acessíveis de qualquer lugar (celular, notebook, IP Phone), URA com redirecionamento inteligente, discador para call center, gravação de chamadas e métricas em tempo real, tudo sem infraestrutura física.",
  proof: [{ label: "Economia na telefonia", value: "até 60%" }],
  differentiators: [
    "Elimina a necessidade de PABX físico — tudo em nuvem, com escalabilidade imediata",
    "Ramais acessíveis remotamente: celular, notebook ou IP Phone",
    "Atendimento unificado: telefone, WhatsApp, e-mail e redes sociais no mesmo painel",
    "Integração com CRMs, ERPs e Microsoft Teams",
    "Painel de gestão online com métricas em tempo real",
  ],
};

const SEGMENTS = [
  {
    name: "Call centers e centrais de atendimento",
    pain: "Custo alto de infraestrutura física de PABX e dificuldade de escalar ramais rapidamente",
  },
  {
    name: "PMEs em geral",
    pain: "Tarifas de telefonia elevadas e falta de mobilidade — atendimento preso a uma linha física",
  },
  {
    name: "Empresas com operação remota/híbrida",
    pain: "Time espalhado sem um número único de empresa; ligações caindo em celular pessoal",
  },
  {
    name: "Empresas com múltiplos canais de atendimento",
    pain: "WhatsApp, e-mail, redes sociais e telefone cada um em uma ferramenta diferente, sem visão unificada",
  },
];

const STAGES = [
  {
    name: "Lead",
    goal: "Capturar interesse (formulário do site: empresa, cargo, WhatsApp, e-mail, nº de colaboradores)",
    criteria: "Contato identificado com porte da empresa e nº aproximado de ramais/colaboradores",
    action: "Qualificar em até 24h via WhatsApp ou ligação",
  },
  {
    name: "Qualificação",
    goal: "Entender o cenário atual de telefonia e o fit",
    criteria: "Gasto atual com telefonia, nº de ramais necessários e canais usados hoje mapeados",
    action: "Agendar demonstração gratuita",
  },
  {
    name: "Demonstração",
    goal: "Mostrar o painel, ramais remotos e atendimento omnichannel na prática",
    criteria: "Demo realizada com decisor (TI, operações ou gestor do call center)",
    action: "Enviar proposta com economia estimada em até 48h",
  },
  {
    name: "Proposta",
    goal: "Formalizar oferta com a economia projetada frente ao custo atual",
    criteria: "Proposta enviada com comparativo de custo atual vs. Onvox",
    action: "Follow-up em 3 dias úteis",
  },
  {
    name: "Negociação",
    goal: "Alinhar condições finais (nº de ramais, integrações, prazo de migração)",
    criteria: "Objeções principais mapeadas e endereçadas",
    action: "Confirmar decisão em até 7 dias",
  },
  {
    name: "Fechamento",
    goal: "Converter em cliente e iniciar migração",
    criteria: "Contrato assinado ou oportunidade perdida com motivo registrado",
    action: "Passar para implantação (portabilidade de número, configuração de ramais) ou registrar motivo de perda",
  },
];

const QUALIFYING_QUESTIONS = [
  "Quanto vocês gastam hoje, em média, por mês com telefonia (PABX físico, linhas, tarifas)?",
  "Quantos ramais/colaboradores precisam de atendimento telefônico?",
  "O time trabalha 100% presencial, remoto ou híbrido?",
  "Hoje o atendimento é feito em quais canais (telefone, WhatsApp, e-mail, redes sociais)? Estão integrados ou cada um em um lugar?",
  "Vocês usam algum CRM ou ERP que precisa estar integrado à telefonia?",
  "Já perderam ligação ou tiveram queda de atendimento por limitação da infraestrutura atual?",
];

const SELLING_STRATEGIES = [
  {
    title: "Ancore na economia, não na tecnologia",
    detail:
      "O gancho mais forte da página é \"economize até 60% na telefonia\". Peça o valor atual gasto com telefonia já na qualificação e devolva uma estimativa de economia na proposta — isso vende mais rápido do que listar funcionalidades.",
  },
  {
    title: "Venda para quem sente a dor da mobilidade",
    detail:
      "Empresas com time remoto/híbrido ou múltiplas unidades são o fit mais rápido de fechar: a dor de \"não ter um número único da empresa\" é concreta e imediata. Priorize esse segmento em prospecção ativa.",
  },
  {
    title: "Use a demonstração gratuita como etapa central, não como bônus",
    detail:
      "A página inteira empurra para \"Solicitar Demonstração Grátis\" — é o principal ativo de conversão. Nunca pule direto para proposta sem antes agendar a demo: é nela que o prospect vê o painel, os ramais remotos e o atendimento unificado funcionando.",
  },
  {
    title: "Fale com o decisor certo",
    detail:
      "O formulário pede cargo e nº de colaboradores — indício de que o Onvox mira decisores de TI/operações e gestores de call center, não o dono sozinho. Nessas contas, valide se quem está na reunião tem autoridade para aprovar mudança de infraestrutura.",
  },
  {
    title: "Trate integração como diferencial, não como detalhe técnico",
    detail:
      "CRM, ERP e Microsoft Teams aparecem como integrações do produto. Pergunte cedo quais sistemas o prospect já usa — se houver integração direta, isso remove a maior objeção técnica de TI antes que ela apareça.",
  },
];

const OBJECTIONS = [
  {
    question: "A qualidade da ligação não vai cair por ser via internet?",
    answer:
      "PABX em nuvem depende de conexão estável — reforce que a solução foi feita para call center (uso intensivo) e recomende validar a internet do cliente na demonstração. Confirmar com o time técnico requisitos mínimos de banda antes de prometer SLA.",
  },
  {
    question: "Dá para portar os números de telefone atuais?",
    answer:
      "Ponto a confirmar com o time técnico/comercial antes da proposta — não assumir prazo ou viabilidade sem validar caso a caso.",
  },
  {
    question: "Quanto tempo leva para migrar do PABX atual para o Onvox?",
    answer:
      "Não há prazo público — levantar com o time de implantação e comunicar prazo real na proposta, não na primeira ligação.",
  },
  {
    question: "Isso integra com o CRM/ERP que já usamos?",
    answer:
      "A plataforma anuncia integração com CRMs, ERPs e Microsoft Teams. Validar a ferramenta específica do prospect com o time técnico antes de confirmar.",
  },
  {
    question: "Qual o investimento mensal para o nosso número de ramais?",
    answer:
      "Não há tabela de preços pública — o caminho é levar para demonstração e proposta personalizada, nunca tentar estimar valor de cabeça.",
  },
];

export default function OnvoxPlaybookPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Playbook de Vendas — Onvox</h1>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>
          Processo comercial para vender o Onvox (PABX em nuvem e atendimento
          omnichannel): o que dizer, para quem, e como conduzir cada etapa.
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

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Segmentos-alvo (ICP)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SEGMENTS.map((seg) => (
            <div
              key={seg.name}
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <h3 className="font-medium">{seg.name}</h3>
              <p className="mt-2 text-sm">
                <span className="font-medium">Dor: </span>
                <span style={{ color: "var(--text-muted)" }}>{seg.pain}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="space-y-3 rounded-lg border p-4"
        style={{ borderColor: "var(--accent)", background: "var(--surface)" }}
      >
        <h2 className="text-lg font-semibold">Melhores formas de vender</h2>
        <div className="space-y-4">
          {SELLING_STRATEGIES.map((s) => (
            <div key={s.title}>
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{s.detail}</p>
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
          Usar na etapa de Qualificação para dimensionar custo atual, dor de mobilidade e
          urgência — a economia estimada na proposta depende dessas respostas.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
          {QUALIFYING_QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Objeções frequentes</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          A página do Onvox não publica FAQ nem preços — estas são as objeções mais
          prováveis para telefonia em nuvem. Validar respostas com o time técnico/comercial
          antes de usar em campo.
        </p>
        <div
          className="overflow-x-auto rounded-lg border"
          style={{ borderColor: "var(--border)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                <th className="px-4 py-2 font-medium">Pergunta / objeção</th>
                <th className="px-4 py-2 font-medium">Como responder</th>
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
