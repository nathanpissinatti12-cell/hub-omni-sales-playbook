const PRODUCT = {
  pitch:
    "PABX em nuvem completo com telefonia omnichannel para call centers e centrais de atendimento: ramais ilimitados acessíveis de qualquer lugar (celular, notebook, IP Phone), URA com redirecionamento inteligente, discador para call center, gravação de chamadas e métricas em tempo real, tudo sem infraestrutura física.",
  explainer:
    "Em resumo: o Onvox substitui a central telefônica física (aquele armário de equipamento na sala do PABX) por um sistema que roda na nuvem. O prospect para de depender de uma linha física fixa e passa a ter ramais que funcionam em qualquer lugar com internet — e ainda ganha um painel só para telefone, WhatsApp, e-mail e redes sociais.",
  proof: [
    { label: "Economia na telefonia", value: "até 60%", why: "Vem principalmente de eliminar manutenção de equipamento físico, tarifas de linha tradicional e a necessidade de comprar/trocar hardware de PABX." },
  ],
  differentiators: [
    {
      title: "Elimina a necessidade de PABX físico",
      detail: "Sem armário de equipamento, sem manutenção de hardware, sem técnico indo até o escritório — e escala (adicionar ramal) é imediata, não depende de comprar mais equipamento.",
    },
    {
      title: "Ramais acessíveis remotamente (celular, notebook, IP Phone)",
      detail: "Resolve o problema de time híbrido/remoto: o número da empresa toca no dispositivo da pessoa, não fica preso a uma mesa física.",
    },
    {
      title: "Atendimento unificado: telefone, WhatsApp, e-mail e redes sociais no mesmo painel",
      detail: "O gestor deixa de precisar abrir 4 ferramentas diferentes para saber o que está acontecendo no atendimento — tudo em um lugar só.",
    },
    {
      title: "Integração com CRMs, ERPs e Microsoft Teams",
      detail: "Importa para prospects com operação já estruturada — mostra que trocar de PABX não significa perder a integração que já existe com o resto do sistema da empresa.",
    },
    {
      title: "Painel de gestão online com métricas em tempo real",
      detail: "Dá ao gestor visibilidade que normalmente não existe em PABX físico tradicional (tempo de espera, volume por ramal, chamadas perdidas).",
    },
  ],
};

const SEGMENTS = [
  {
    name: "Call centers e centrais de atendimento",
    pain: "Custo alto de infraestrutura física de PABX e dificuldade de escalar ramais rapidamente",
    approach: "Pergunte quanto tempo leva hoje para colocar um novo ramal/atendente operando — normalmente é dias com PABX físico, e isso vira minutos em nuvem.",
  },
  {
    name: "PMEs em geral",
    pain: "Tarifas de telefonia elevadas e falta de mobilidade — atendimento preso a uma linha física",
    approach: "Peça a fatura de telefonia atual — comparar valor pago hoje com a economia estimada é o argumento mais direto para esse público.",
  },
  {
    name: "Empresas com operação remota/híbrida",
    pain: "Time espalhado sem um número único de empresa; ligações caindo em celular pessoal",
    approach: "Pergunte se hoje o cliente liga para o celular pessoal de algum colaborador — é um sinal claro de que falta um número único da empresa.",
  },
  {
    name: "Empresas com múltiplos canais de atendimento",
    pain: "WhatsApp, e-mail, redes sociais e telefone cada um em uma ferramenta diferente, sem visão unificada",
    approach: "Pergunte quantas ferramentas diferentes o time usa para atender hoje — quanto mais fragmentado, mais forte o argumento do painel unificado.",
  },
];

const STAGES = [
  {
    name: "Lead",
    goal: "Capturar interesse (formulário do site: empresa, cargo, WhatsApp, e-mail, nº de colaboradores)",
    criteria: "Contato identificado com porte da empresa e nº aproximado de ramais/colaboradores",
    action: "Qualificar em até 24h via WhatsApp ou ligação",
    why: "O formulário já traz porte e nº de colaboradores — use isso para triar antes mesmo de ligar, evitando qualificar quem claramente não tem volume suficiente.",
  },
  {
    name: "Qualificação",
    goal: "Entender o cenário atual de telefonia e o fit",
    criteria: "Gasto atual com telefonia, nº de ramais necessários e canais usados hoje mapeados",
    action: "Agendar demonstração gratuita",
    why: "Sem saber o gasto atual, não dá para prometer economia depois — esse número é a base de toda a proposta.",
  },
  {
    name: "Demonstração",
    goal: "Mostrar o painel, ramais remotos e atendimento omnichannel na prática",
    criteria: "Demo realizada com decisor (TI, operações ou gestor do call center)",
    action: "Enviar proposta com economia estimada em até 48h",
    why: "É o momento em que o prospect vê a diferença na prática — pular a demo e ir direto para proposta é o erro mais comum nesse funil.",
  },
  {
    name: "Proposta",
    goal: "Formalizar oferta com a economia projetada frente ao custo atual",
    criteria: "Proposta enviada com comparativo de custo atual vs. Onvox",
    action: "Follow-up em 3 dias úteis",
    why: "A proposta só convence se mostrar o comparativo lado a lado (hoje vs. Onvox) — número solto sem contexto não vende.",
  },
  {
    name: "Negociação",
    goal: "Alinhar condições finais (nº de ramais, integrações, prazo de migração)",
    criteria: "Objeções principais mapeadas e endereçadas",
    action: "Confirmar decisão em até 7 dias",
    why: "Migração de telefonia é uma decisão com peso operacional — dê espaço para as dúvidas técnicas (portabilidade, integração) serem esclarecidas de verdade.",
  },
  {
    name: "Fechamento",
    goal: "Converter em cliente e iniciar migração",
    criteria: "Contrato assinado ou oportunidade perdida com motivo registrado",
    action: "Passar para implantação (portabilidade de número, configuração de ramais) ou registrar motivo de perda",
    why: "Registrar o motivo de perda ajuda a identificar se é preço, prazo de migração ou falta de recurso técnico — cada motivo pede um ajuste diferente na abordagem.",
  },
];

const QUALIFYING_QUESTIONS = [
  {
    q: "Quanto vocês gastam hoje, em média, por mês com telefonia (PABX físico, linhas, tarifas)?",
    why: "É o número base para calcular e provar a economia estimada na proposta — sem ele, a promessa de \"até 60%\" fica abstrata.",
  },
  {
    q: "Quantos ramais/colaboradores precisam de atendimento telefônico?",
    why: "Define o tamanho do projeto e ajuda a dimensionar a proposta corretamente.",
  },
  {
    q: "O time trabalha 100% presencial, remoto ou híbrido?",
    why: "Se há qualquer parcela remota, o argumento de \"ramal em qualquer lugar\" se torna central na venda.",
  },
  {
    q: "Hoje o atendimento é feito em quais canais (telefone, WhatsApp, e-mail, redes sociais)? Estão integrados ou cada um em um lugar?",
    why: "Mostra se o painel omnichannel resolve uma dor real de fragmentação ou se é um recurso a mais sem urgência.",
  },
  {
    q: "Vocês usam algum CRM ou ERP que precisa estar integrado à telefonia?",
    why: "Antecipa a objeção técnica mais comum de TI antes que ela apareça na negociação.",
  },
  {
    q: "Já perderam ligação ou tiveram queda de atendimento por limitação da infraestrutura atual?",
    why: "Transforma uma dor vaga (\"a telefonia é ruim\") em um evento concreto para usar na proposta.",
  },
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
        className="space-y-2 rounded-lg border p-4 text-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <h2 className="font-semibold">Como usar este playbook</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Siga a ordem das seções: entenda o produto, veja para quem ele é melhor (ICP), leia
          as melhores formas de vender, acompanhe o funil etapa por etapa, use as perguntas de
          qualificação para conduzir a conversa, e recorra à tabela de objeções na negociação.
          Como a página pública do Onvox não publica FAQ nem preços, várias respostas abaixo
          precisam ser confirmadas com o time técnico/comercial antes de repassar ao prospect —
          isso está marcado onde relevante.
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
        <h2 className="text-lg font-semibold">Segmentos-alvo (ICP)</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          ICP (Ideal Customer Profile) é o perfil de cliente que mais sente a dor que o Onvox
          resolve e fecha mais rápido. Use os segmentos abaixo para priorizar prospecção — cada
          um tem uma dor e uma pergunta-gancho diferente.
        </p>
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
              <p className="mt-2 text-sm">
                <span className="font-medium">Como abordar: </span>
                <span style={{ color: "var(--text-muted)" }}>{seg.approach}</span>
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
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          O funil é a sequência de etapas que uma oportunidade percorre até o fechamento. Cada
          etapa tem um objetivo e um critério de avanço — pular direto para proposta sem
          demonstração, por exemplo, costuma reduzir a taxa de fechamento.
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
          Usar na etapa de Qualificação para dimensionar custo atual, dor de mobilidade e
          urgência — a economia estimada na proposta depende dessas respostas.
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
