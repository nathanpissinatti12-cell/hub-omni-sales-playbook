// Conteúdo do Playbook de Vendas Omni Assessoria — Módulo 3 (Vendas /
// Closers), transcrito de "Modulo3_Vendas_Closers_Omni.pdf" (Versão 1.0,
// Maio 2026). Conteúdo mantido fiel ao documento original — não
// editorializar números, scripts ou nomes de clientes sem nova fonte.
// A numeração de perguntas do Raio-X segue exatamente o documento fonte
// (pula de 43 para 46 no Bloco 7, conforme o PDF original).

export type ClosingObjection = {
  tag: string;
  question: string;
  answer: string;
};

// Movido do Módulo 1 (Fundação Estratégica) — são objeções de nível
// executivo, próprias da reunião de negociação do closer, e não da
// abordagem inicial de BDR/cold call (essas ficam no Módulo 2).
export const CLOSER_OBJECTION_SCRIPTS: ClosingObjection[] = [
  {
    tag: "INÉRCIA",
    question: "\"Já tenho uma operadora. Está funcionando.\"",
    answer:
      "\"Entendo. A maioria dos nossos clientes pensava assim antes de fazer o Raio-X. A questão não é se 'está funcionando' — é quanto está custando além do que aparece na fatura. Ligações perdidas sem registro, ramal que cai, manutenção de hardware, falta de dado para gestão... isso não aparece no boleto, mas aparece no resultado. Posso propor uma análise gratuita? Se não tiver gargalo, você sai com a confirmação de que está bem. Se tiver, você vai saber exatamente onde está perdendo dinheiro.\"",
  },
  {
    tag: "PREÇO",
    question: "\"Vocês são mais caros do que o concorrente X.\"",
    answer:
      "\"Depende do que você está comparando. O concorrente mostrou um preço por ramal — mas incluiu URA, gravação, dashboard, suporte 24/7 e integração com CRM? Porque muitos players têm preço de entrada baixo e cobram tudo no detalhe. Posso te mandar uma comparação lado a lado do custo total? E além do custo, tem a pergunta mais importante: o que acontece quando cai? Nosso SLA é de [X] e temos suporte dedicado. Qual é o compromisso deles?\"",
  },
  {
    tag: "ORÇAMENTO",
    question: "\"Não tenho orçamento agora.\"",
    answer:
      "\"Faz sentido. Por isso o Raio-X é importante: dependendo dos números, a Omni não é um custo — é uma redução de custo. A Neobetel, por exemplo, reduziu 20% na conta de telefonia e 80% na linha 0800. Se você está pagando R$X por mês hoje e a gente consegue baixar para R$Y com mais funcionalidade, o ROI se paga sozinho. Posso calcular esse número com você antes de qualquer decisão?\"",
  },
  {
    tag: "DECISÃO",
    question: "\"Preciso falar com o TI / com meu sócio / com a diretoria.\"",
    answer:
      "\"Claro, faz todo sentido envolver quem precisa. Para facilitar esse processo, posso preparar um documento executivo com o diagnóstico e o business case — algo que você possa apresentar internamente sem ter que explicar tudo do zero. Poderia marcar uma reunião com o TI e o decisor juntos? Às vezes é mais eficiente eu apresentar diretamente e tirar as dúvidas técnicas na hora.\"",
  },
  {
    tag: "EXP. NEGATIVA",
    question: "\"Já testamos uma plataforma de WhatsApp e não funcionou.\"",
    answer:
      "\"Isso é muito mais comum do que parece, e quase sempre o problema não foi a plataforma — foi a implementação. Plataformas genéricas instalam e somem. O diferencial da Omni é a nossa metodologia de implantação: mapeamos o fluxo de atendimento, configuramos os chatbots com a sua lógica de negócio e treinamos o time. Além disso, temos suporte 24/7 e um CS dedicado que monitora os primeiros 90 dias. Você pode conversar com um dos nossos clientes que passou por isso antes de decidir?\"",
  },
  {
    tag: "RISCO TÉCNICO",
    question: "\"Tenho medo da migração quebrar o que já tenho.\"",
    answer:
      "\"Essa é a principal preocupação de quem tem uma operação crítica — e é por isso que a gente tem um processo de migração em fases, sem downtime. A implementação começa em paralelo, validamos tudo antes de cortar, e ficamos ao lado do time técnico durante a transição. Nos 15 anos de mercado, nunca tivemos uma migração que causou interrupção de operação. Posso apresentar nosso protocolo técnico de migração?\"",
  },
  {
    tag: "CONTRATO",
    question: "\"O contrato é muito longo. Não quero ficar preso.\"",
    answer:
      "\"Entendo a preocupação. Nossos contratos têm prazo porque a implementação tem custo e queremos garantir que o cliente colha resultado. Mas o que prende o cliente não é o contrato — é o resultado. O British Council está conosco há mais de 5 anos porque quer, não porque é obrigado. Podemos conversar sobre flexibilidade de prazo dependendo do escopo, mas o mais importante é você entender que o seu risco é mínimo: temos SLA, suporte e uma equipe que responde quando você precisa.\"",
  },
];

export const CLOSER_BEHAVIORAL = [
  "Escuta ativa genuína — sabe ficar em silêncio e deixar o cliente falar",
  "Curiosidade consultiva — faz perguntas que aprofundam, não que encerram",
  "Disciplina de processo — preenche CRM, segue protocolo, não improvisa etapas",
  "Orientação a resultado — pensa em ROI do cliente, não em comissão própria",
  "Presença executiva — consegue conversar com gestores de TI, diretores e sócios no mesmo nível",
  "Resiliência — ciclo de venda consultivo tem objeções, silêncios e adiamentos; o closer não some",
];

export const CLOSER_TECHNICAL = [
  "Domínio dos produtos: TakeFlow, Onvox, Evolue AI e suas combinações",
  "Capacidade de construir cálculo de ROI na reunião com os dados do cliente",
  "Conhecimento básico de tecnologia (API, integração, CRM, telefonia em nuvem) para não perder credibilidade com perfis técnicos",
  "Fluência no HubSpot — pipeline, registro de atividades, campos obrigatórios por etapa",
];

export const CLOSER_NOT = [
  "Não é apresentador de slides",
  "Não manda proposta padrão",
  "Não espera o cliente ligar de volta",
  "Não vende funcionalidade — vende resultado",
];

export const SALES_CYCLE = [
  { etapa: "1. Oportunidade", funil: "Entrada", descricao: "Lead gerado pelo pré-vendas (SDR/BDR), reunião agendada" },
  { etapa: "2. Diagnóstico", funil: "Reunião 1", descricao: "Primeira reunião realizada; mapeamento completo da operação do cliente" },
  { etapa: "3. Solicitação de Projeto", funil: "Interno", descricao: "Diagnóstico concluído; projeto técnico solicitado internamente para dimensionar a solução" },
  { etapa: "4. Demonstração da Solução", funil: "Reunião 2", descricao: "Segunda reunião; apresentação da solução personalizada com ROI" },
  { etapa: "5. Negociação", funil: "Comercial", descricao: "Proposta em discussão; ajustes comerciais em andamento" },
  { etapa: "6. Contrato Enviado", funil: "Jurídico", descricao: "Proposta formalizada e enviada para assinatura" },
  { etapa: "7. Em Ativação", funil: "Implantação", descricao: "Contrato assinado; produto em processo de implantação" },
  { etapa: "8. Fechado Ganho", funil: "Concluído", descricao: "Implantação concluída; venda computada e encaminhada para pagamento" },
  { etapa: "9. Fechado Perdido", funil: "Encerrado", descricao: "Negócio desqualificado em qualquer etapa" },
];

export const HUBSPOT_FIELDS = [
  {
    transition: "Oportunidade → Diagnóstico",
    fields: ["Oportunidade bem mapeada pelo pré-vendedor (Sim/Não)"],
  },
  {
    transition: "Diagnóstico → Solicitação de Projeto",
    fields: [
      "Oportunidade bem mapeada pelo pré-vendedor",
      "Prioridade para contratação da solução",
      "Orçamento para contratar a solução",
      "Contato feito com o responsável pela compra",
      "Solução para as dores",
      "Solicitar projeto",
      "Gatilho de comparecimento à reunião",
      "Valor do negócio em potencial",
      "Temperatura do diagnóstico",
      "Valor",
    ],
  },
  {
    transition: "Demonstração da Solução → Negociação",
    fields: [
      "Oportunidade bem mapeada pelo pré-vendedor",
      "Prioridade para contratação da solução",
      "Orçamento para contratar a solução",
      "Contato feito com o responsável pela compra",
      "Solução para as dores",
      "Valor",
      "Oportunidade Onvox (Sim/Não)",
      "Oportunidade TakeFlow (Sim/Não)",
      "Oportunidade Evolue AI (Sim/Não)",
      "Temperatura",
      "Data de fechamento",
    ],
  },
];

export const ACTIVITY_TYPES = [
  "Mensagens enviadas (WhatsApp, e-mail)",
  "Ligações realizadas",
  "E-mails enviados",
  "Qualquer outro ponto de contato",
];

export const MEETING_LOG_FLOW = [
  "Reunião realizada via Google Meet → transcrição gerada automaticamente",
  "Transcrição é processada no Evolue AI (ferramenta de análise de abordagem por IA)",
  "Evolue AI gera um resumo analítico da conversa",
  "Resumo é colado pelo closer como nota/atividade dentro do card no HubSpot",
];

export const DIAGNOSTIC_PRE_CHECKLIST = [
  "Pesquisa sobre a empresa: mercado, porte, tempo de operação, posicionamento",
  "Pesquisa sobre o gestor: função, tempo de empresa, posts recentes no LinkedIn",
  "Brief do SDR/BDR: dor levantada na qualificação, produto-foco inicial, microfechamento já realizado",
  "Hipótese inicial de produto: TakeFlow puro? TakeFlow + Onvox? TakeFlow + Evolue AI?",
  "Roteiro de diagnóstico aberto na tela",
];

export type DiagQuestion = { n: string; q: string; notes?: string[] };

export const DIAGNOSTIC_BLOCKS: { title: string; duration: string; intro?: string; questions: DiagQuestion[] }[] = [
  {
    title: "Bloco 1 — Contexto e Posicionamento",
    duration: "5 a 7 minutos",
    intro: "Objetivo: Entender quem é a empresa e como o WhatsApp é usado hoje.",
    questions: [
      { n: "1", q: "Me conta um pouco sobre a empresa — o que vocês fazem, há quanto tempo estão no mercado e qual o porte da operação hoje?", notes: ["Aprofundar: Quantas filiais? Quantos colaboradores? Faturamento aproximado?", "Escutar: Multi-loja ou multi-filial = gancho de Onvox"] },
      { n: "2", q: "Qual o seu papel na empresa e há quanto tempo está nessa função?", notes: ["Aprofundar: Você herdou os processos atuais ou foi você quem montou? Tem autonomia para decidir nessa frente?", "Escutar: Validação de autoridade. Se disser \"meu sócio decide junto\", abrir porta para trazer o sócio na próxima reunião"] },
      { n: "3", q: "Como vocês captam clientes hoje? Quais são os principais canais de geração de demanda?", notes: ["Aprofundar: Investem em ads (Google, Meta)? Indicação? Tráfego orgânico?", "Escutar: Operação que investe em ads sente carrinho perdido — calibrar demonstração"] },
      { n: "4", q: "Como o WhatsApp é usado no atendimento? Usam WhatsApp Business comum, API oficial, plataforma multi-atendente, ou cada atendente tem seu próprio número?", notes: ["Escutar: Business comum com múltiplos atendentes no mesmo número = operação que vai quebrar — gancho forte"] },
      { n: "5", q: "Existem outros canais além do WhatsApp? Telefone, Instagram, chat, e-mail?", notes: ["Escutar: Telefone com peso >20% = cross-sell Onvox. Instagram = gancho de centralização multicanal"] },
      { n: "6", q: "Há quanto tempo operam dessa forma? Já passaram por mudanças de plataforma?", notes: ["Escutar: Histórico de mudanças anteriores = objeções futuras. Mapear por que desistiram antes"] },
    ],
  },
  {
    title: "Bloco 2 — Estrutura do Time e Operação",
    duration: "8 a 10 minutos",
    questions: [
      { n: "7", q: "Quantas pessoas atendem clientes pelo WhatsApp simultaneamente? E no time todo?" },
      { n: "8", q: "Como o time está estruturado em setores ou filas? (Vendas, Suporte, Financeiro, Pós-venda)", notes: ["Escutar: Mais de 3–4 filas = operação madura. Tudo misturado numa fila só = caos — entrega forte da plataforma"] },
      { n: "9", q: "A distribuição de novas conversas é automática ou manual?", notes: ["Escutar: Manual = perda quase certa de leads"] },
      { n: "10", q: "Existe regra clara de transferência entre atendentes ou setores?" },
      { n: "11", q: "Qual o horário de atendimento via WhatsApp? O que acontece fora do horário?", notes: ["Escutar: Mensagem fora do horário sem resposta = ROI calculável"] },
      { n: "12", q: "Vocês têm meta de tempo de primeira resposta? Conseguem cumprir?", notes: ["Escutar: Lead sem resposta em 5 minutos tem 80% mais chance de fechar com concorrente"] },
    ],
  },
  {
    title: "Bloco 3 — Volume e Dimensionamento",
    duration: "8 a 10 minutos",
    intro: "Por que esse bloco é crítico: o pacote TakeFlow IA varia de R$ 1.369,50 (50 atendimentos/dia, N1) até R$ 11.449,50 (300 atendimentos/dia, N2). Subdimensionar dói no cliente — e ele culpa a Omni. Não pule perguntas deste bloco.",
    questions: [
      { n: "13", q: "Qual o volume médio de atendimentos por dia pelo WhatsApp? (Somar todas as filas)", notes: ["Se não souber: pergunte por mês e divida por 22 dias úteis. Se ainda não souber: \"é exatamente isso que a plataforma resolve — visibilidade que vocês não têm hoje\""] },
      { n: "14", q: "Qual é o pico — em campanhas, sazonalidade, lançamento?", notes: ["Escutar: Pico define se propõe pacote maior ou acúmulo intra-mês"] },
      { n: "15", q: "Desse volume, quanto é cliente novo e quanto é recorrente?", notes: ["CRÍTICO: Limite TakeFlow = ~40 novos contatos/dia por número. Se passar disso, precisa arquitetura com múltiplos números"] },
      { n: "16", q: "Vocês fazem disparos ativos para a base? Com que frequência e volume?" },
      { n: "17", q: "Quanto tempo dura uma conversa típica de venda do começo ao fim?" },
      { n: "18", q: "Qual o ticket médio de um cliente típico?" },
      { n: "19", q: "Vocês conseguem estimar a taxa de conversão atual?", notes: ["Escutar: Conversão atual é a base do cálculo de ROI"] },
    ],
  },
  {
    title: "Bloco 4 — Dores, Gargalos e Tentativas Anteriores",
    duration: "10 a 12 minutos",
    intro: "Esse é o bloco mais consultivo. Usar metodologia SPIN: Situação (já mapeada), Problema (aqui), Implicação (materialização financeira), Necessidade de solução (fechamento).",
    questions: [
      { n: "20", q: "Quais são os maiores desafios de operar o WhatsApp hoje, na sua percepção?", notes: ["Deixar o cliente falar 2 a 3 minutos sem interromper. Anotar tudo. Aprofundar no que mais doer"] },
      { n: "21", q: "Já aconteceu de perder uma venda porque a resposta demorou, o lead esfriou, ou o atendente esqueceu de retornar?", notes: ["Aprofundar: Lembra de algum caso específico? — Caso específico com nome é ouro para construir ROI tangível na Demonstração"] },
      { n: "22", q: "Quando um atendente sai do time, o que acontece com os contatos que ele atendia? E com o histórico?", notes: ["Escutar: Dor universal de operação com WhatsApp pessoal — gancho de centralização"] },
      { n: "23", q: "Como vocês fazem o controle das conversas hoje? O gestor consegue ver o que o atendente está fazendo?", notes: ["Escutar: \"Caixa-preta\" é a dor mais central para o gestor — abre porta para Evolue AI"] },
      { n: "24", q: "Vocês já tiveram problema com WhatsApp banido ou bloqueado?", notes: ["Escutar: Se sim, dor altíssima — usar capacidade técnica da API oficial como prova"] },
      { n: "25", q: "Pensando nessas dores, o que isso significa em receita perdida ou custo extra para a operação?", notes: ["Se não conseguir estimar: \"Se você perde 1 venda por dia que valeria X reais, em 30 dias é Y, em 12 meses é Z\""] },
      { n: "26", q: "Quanto custa cada atendente do time de WhatsApp para a empresa? (Salário + encargos + equipamento)", notes: ["Escutar: Base direta de cálculo de ROI — \"vamos liberar 50% do tempo do seu atendente\""] },
      { n: "27", q: "Vocês já testaram alguma plataforma de WhatsApp profissional antes? Se sim, qual e por que pararam?", notes: ["Escutar: Se citar concorrente, mapear objeções que teve — vira insumo para battlecard"] },
      { n: "28", q: "Estão considerando outras opções além da Omni?", notes: ["Escutar: Se há concorrência ativa, a Demonstração precisa endereçar diferenciais explicitamente"] },
    ],
  },
  {
    title: "Bloco 5 — Stack Tecnológico e Integrações",
    duration: "5 a 7 minutos",
    questions: [
      { n: "29", q: "Vocês usam algum CRM hoje? Qual?", notes: ["Escutar: CRM em uso = integração obrigatória na Demonstração"] },
      { n: "30", q: "O CRM conversa com o WhatsApp? Ou alguém copia e cola manualmente?", notes: ["Escutar: Copia-cola = dor de retrabalho enorme — integração automática é entrega direta de produtividade"] },
      { n: "31", q: "Usam ERP, sistema de e-commerce, gestão financeira ou agendamento que precisaria conversar com o WhatsApp?" },
      { n: "32", q: "Já existe algum chatbot ou automação no WhatsApp hoje?", notes: ["Escutar: Chatbot por regras frustrado = candidato quase fechado para IA"] },
      { n: "33", q: "Já consideraram usar Inteligência Artificial para atender? Quais são as preocupações?", notes: ["Escutar: Mapear objeções — cada uma é uma frente do battlecard de IA"] },
      { n: "34", q: "Qual o tom de comunicação da empresa? Formal, casual, técnico?" },
      { n: "35", q: "Além do WhatsApp, qual o volume de ligações telefônicas por dia?", notes: ["Escutar: Volume relevante = cross-sell Onvox. PABX físico = caso clássico de migração para nuvem"] },
      { n: "36", q: "Essas ligações são gravadas? Alguém audita o conteúdo?", notes: ["Escutar: Grava mas não escuta = candidato perfeito para Evolue AI — \"vocês têm o material, falta a inteligência para extrair valor\""] },
    ],
  },
  {
    title: "Bloco 6 — Performance Comercial e ROI",
    duration: "5 a 7 minutos",
    intro: "Por que esse bloco é decisivo: ROI materializado é o argumento mais forte na Demonstração. Cliente que vê o cálculo na frente dele se autoconvence. Mesmo dado estimado pelo cliente serve — conservar 50% para credibilidade é melhor que projetar otimista.",
    questions: [
      { n: "37", q: "Vocês investem em mídia paga? Aproximadamente quanto por mês? Quantos leads isso gera?", notes: ["Escutar: Alto investimento em ads = cada lead perdido por demora vale ouro"] },
      { n: "38", q: "Qual o ciclo de venda médio — do primeiro contato no WhatsApp até o cliente fechar?" },
      { n: "39", q: "Quantos leads chegam por dia somando todos os canais? Quantos viram oportunidade real?" },
      { n: "40", q: "Qual sua estimativa de quanto a empresa perde por mês com as falhas de atendimento atuais?", notes: ["Mesmo um chute: R$ 5 mil? R$ 20 mil? R$ 100 mil? — Esse número é o teto da proposta"] },
      { n: "41", q: "Se a IA permitisse atender o dobro sem aumentar headcount, qual o impacto para o negócio?" },
      { n: "42", q: "O que valeria mais para vocês: (a) automatizar primeiro contato, (b) reduzir tempo de espera, (c) ter visibilidade do time, (d) escalar sem contratar?", notes: ["Escutar: A resposta define a abertura da Demonstração"] },
      { n: "43", q: "Vocês medem hoje algum indicador de atendimento? Tempo de resposta, conversão, NPS?" },
    ],
  },
  {
    title: "Bloco 7 — Decisão, Autoridade e Próximos Passos",
    duration: "5 a 8 minutos",
    questions: [
      { n: "46", q: "Caso a gente desenhe uma solução que faça sentido, a decisão passa só por você ou envolve mais alguém?", notes: ["Aprofundar: Sócio? Diretor? TI? Financeiro? Quem precisaria estar na próxima conversa?", "Regra de ouro: Se há decisor adicional, trazê-lo para a próxima reunião — senão o closer vai repetir tudo"] },
      { n: "47", q: "Vocês têm orçamento já alocado para essa frente em 2026, ou seria uma decisão de orçamento novo?", notes: ["Se recuar: \"Caso a solução se pague em economia ou aumento de receita, isso muda a equação?\""] },
      { n: "48", q: "Existe algum prazo ou evento que torna essa decisão mais urgente?", notes: ["Se não há prazo: \"Numa escala de 0 a 10, qual a urgência hoje de resolver isso?\""] },
      { n: "49", q: "Em quanto tempo precisariam estar com a operação rodando?", notes: ["Setup completo da TakeFlow leva entre 1 e 4 semanas dependendo da complexidade"] },
    ],
  },
];

export const DIAGNOSTIC_CLOSING_PROTOCOL = [
  "Confirmar dia, horário, link e quem mais vai participar (especialmente decisor adicional)",
  "Enviar mensagem de confirmação no mesmo dia",
  "Enviar lembrete um dia antes",
  "Enviar link 5 minutos antes da reunião",
];

export const SIGNALS = {
  onvox: [
    "Volume relevante de ligações ou linha fixa convencional",
    "PABX próprio ou pagamento de manutenção de equipamento",
    "Vendedores usando celular pessoal para ligar para clientes",
    "Múltiplas filiais sem ramal único entre elas",
    "Reclamação de operadora atual (Vivo, Claro, Embratel) por preço ou atendimento",
  ],
  evolueAi: [
    "Grava ligações mas \"ninguém escuta\"",
    "Sem visibilidade do que o atendente fala com o cliente",
    "Auditoria atual é manual e por amostragem",
    "Time grande de atendimento sem padrão de qualidade definido",
    "Histórico de problema judicial ou reclamação por algo dito por atendente",
  ],
  bigPackage: [
    "Volume diário superior a 100 atendimentos",
    "Mais de 40 novos contatos/dia",
    "Operação que precisa atender 24/7",
    "Pico semanal/mensal muito superior à média",
    "Múltiplas integrações com sistemas (CRM + ERP + e-commerce)",
  ],
  risk: [
    "Já desistiu de duas ou mais ferramentas anteriores",
    "Espera \"resolver tudo automaticamente\" sem operação humana",
    "Quer disparar volume muito acima da realidade (queima de número certa)",
    "Não tem CRM nem processo definido (vai automatizar o caos)",
    "Decisor real não está presente nem virá na próxima reunião",
  ],
};

export const BETWEEN_MEETINGS_CHECKLIST = [
  "Cálculo de ROI conservador — baseado nos números fornecidos pelo cliente",
  "Proposta de pacote dimensionada — N1 ou N2, qual tier, com cálculo de break-even se relevante",
  "Solicitação de projeto — acionada internamente para Onvox, TakeFlow e Evolue AI conforme identificado",
  "Degustação configurada — IA personalizada com nome, tom e regras de negócio do cliente",
  "Slides ou tela preparada — com os 3 a 5 fluxos prioritários do cliente, demonstráveis ponto a ponto",
  "Cases similares selecionados — mesmo segmento ou mesmo porte para usar como prova social",
  "Antecipação de objeções — 3 principais objeções prováveis com resposta pré-preparada",
  "Cálculo de cross-sell — se há sinais de Onvox e/ou Evolue AI, preparar nota lateral",
];

export const DEMO_RESULT_METRICS = [
  { label: "Eficiência comercial", value: "+20% a +40%" },
  { label: "Aumento em conversão de vendas", value: "+10% a +30%" },
  { label: "Melhoria em NPS/CSAT", value: "+10% a +25%" },
  { label: "Redução em custos operacionais de atendimento", value: "-15% a -35%" },
];

export const PROOF_CASES = [
  "Farma Ponte — varejo farmacêutico, 120 lojas, estruturação do WhatsApp como canal de vendas",
  "Neobetel — -20% na conta de telefonia, -80% na linha 0800",
  "Comvem — -40% em telefonia móvel",
  "British Council — parceria de 5+ anos, redução de custos e melhoria de infraestrutura",
  "Bioderma, Samsonite, Bluefit, NBB — mencionados como referência de carteira",
];

export const MENTAL_TRIGGERS = [
  { title: "Reciprocidade", detail: "A Omni entrega valor antes de cobrar — o Diagnóstico detalhado, o cálculo de ROI personalizado, a degustação configurada. O cliente recebe antes de decidir." },
  { title: "Urgência", detail: "Criar senso de que adiar tem custo. Usar o ROI calculado: \"Cada mês que passa sem estruturar isso representa aproximadamente R$ X em receita que some. Faz sentido começar logo?\"" },
  { title: "Escassez", detail: "Condições comerciais com prazo: \"Essa condição de isenção de implantação é válida até o fim dessa semana.\"" },
  { title: "Prova Social", detail: "Cases de empresas do mesmo segmento ou porte — especialmente quando o cliente hesita." },
  { title: "Autoridade", detail: "Posicionamento como assessoria especializada com 15 anos de mercado. A profundidade do Diagnóstico e a personalização da proposta demonstram autoridade antes de qualquer argumento verbal." },
  { title: "Comprometimento e Coerência", detail: "Usar o que o próprio cliente disse no Diagnóstico para fechar: \"Você me disse que perde aproximadamente R$ 30 mil por mês com isso. A solução custa R$ 5 mil. Faz sentido não avançar?\"" },
];

export const NEGOTIATION_OBJECTIONS = [
  { question: "\"Não é urgente para mim agora\"", answer: "\"Entendo. Mas me ajuda a entender — o que precisaria mudar para isso se tornar urgente? Porque pelos números que mapeamos, cada mês representa R$ X parado. Não estou pressionando — quero entender o que está travando para poder ajudar.\"" },
  { question: "\"Preciso falar com meu sócio/diretor\"", answer: "\"Faz todo sentido. Posso te ajudar com isso — que tal a gente marcar uma reunião rápida com ele presente? Assim eu apresento direto e vocês decidem juntos. Quando ele tem 30 minutos essa semana?\"" },
  { question: "\"Já uso outra ferramenta\"", answer: "\"Que ferramenta é essa? [ouvir] Entendo. Muitos dos nossos clientes vieram de [concorrente]. O que geralmente acontece é [dor específica da ferramenta citada]. Posso mostrar como a gente resolve isso — inclusive podemos fazer um teste paralelo para você comparar na prática.\"" },
  { question: "\"O custo está muito alto\"", answer: "\"Entendo a preocupação. Mas vamos olhar para o outro lado: pelos números que você mesmo me deu, vocês perdem aproximadamente R$ X por mês. O investimento é R$ Y. Em [Z meses] ele se paga — e a partir daí é ganho líquido. O que está caro — o produto ou a perda que está acontecendo hoje?\"" },
  { question: "\"Não quero fidelidade\"", answer: "\"A Omni não trabalha com fidelidade. Nosso modelo é aviso prévio de 60 dias. Se em algum momento não estiver fazendo sentido, você nos avisa e encerramos sem multa. A gente prefere que o cliente fique porque está satisfeito, não porque está preso.\"" },
  { question: "\"Vou avaliar outras opções\"", answer: "\"Faz todo sentido avaliar. Quais critérios você vai usar para comparar? [ouvir] Ótimo. Posso te ajudar com isso — inclusive posso te mostrar exatamente como a Omni se diferencia nos pontos que você mencionou. O que acha de a gente fazer isso juntos antes de você ir para o mercado?\"" },
];

export const CLOSER_HUBSPOT_RESPONSIBILITIES = [
  "Mover o card de etapa imediatamente após o evento que justifica a mudança",
  "Preencher todos os campos obrigatórios de cada etapa sem deixar para depois",
  "Registrar toda atividade de contato com o cliente (ligação, mensagem, e-mail, nota de reunião)",
  "Colar o resumo gerado pelo Evolue AI como nota no card após cada reunião",
  "Manter a data de fechamento estimada atualizada em todos os negócios em negociação",
];

export const CLOSER_DASHBOARDS = [
  "Contratos assinados na quinzena",
  "Contratos assinados no mês",
  "Contratos ativados no mês",
  "Contratos ativados no trimestre",
  "Volume de reuniões realizadas",
];

export const CLOSER_KPIS = [
  { categoria: "Volume", metrica: "Reuniões de Diagnóstico realizadas", frequencia: "Semanal" },
  { categoria: "Volume", metrica: "Reuniões de Demonstração realizadas", frequencia: "Semanal" },
  { categoria: "Conversão", metrica: "Diagnóstico → Demonstração", frequencia: "Mensal" },
  { categoria: "Conversão", metrica: "Demonstração → Negociação", frequencia: "Mensal" },
  { categoria: "Conversão", metrica: "Negociação → Fechado Ganho", frequencia: "Mensal" },
  { categoria: "Qualidade", metrica: "Pontuação no Evolue AI", frequencia: "Semanal" },
  { categoria: "Resultado", metrica: "Contratos assinados na quinzena", frequencia: "Quinzenal" },
  { categoria: "Resultado", metrica: "Contratos assinados no mês", frequencia: "Mensal" },
  { categoria: "Resultado", metrica: "Contratos ativados no mês", frequencia: "Mensal" },
  { categoria: "Resultado", metrica: "Contratos ativados no trimestre", frequencia: "Trimestral" },
  { categoria: "Resultado", metrica: "Valor total de negócios fechados (MRR gerado)", frequencia: "Mensal" },
];

export const CHECKLIST_M3_PROCESSO = [
  "Todos os closers executam pesquisa pré-call antes de toda reunião de Diagnóstico",
  "Todos os closers recebem o brief do SDR antes de entrar na reunião",
  "A reunião de Diagnóstico segue os 7 blocos do roteiro — nenhum bloco crítico pulado",
  "A pergunta sobre decisores e budget é feita em todos os Diagnósticos (Bloco 7)",
  "Toda reunião de Diagnóstico termina com data da próxima reunião confirmada",
  "O período entre Diagnóstico e Demonstração é usado para preparar ROI, projeto e degustação",
  "A Demonstração é personalizada — sem slides ou propostas genéricas",
];

export const CHECKLIST_M3_HUBSPOT = [
  "Cards são movidos de etapa imediatamente após o evento que justifica a mudança",
  "Todos os campos obrigatórios por etapa estão preenchidos",
  "Toda atividade de contato está registrada no card",
  "Resumo do Evolue AI está colado como nota após cada reunião",
  "Datas de fechamento estimadas estão atualizadas",
];

export const CHECKLIST_M3_NEGOCIACAO = [
  "Todo follow-up tem próximo passo específico, datado e com responsável",
  "Decisores adicionais identificados são trazidos para a próxima reunião",
  "Ancoragem de preço é aplicada antes de qualquer desconto",
  "Gatilhos mentais são usados com base na dor específica de cada cliente",
];

export const CHECKLIST_M3_GESTAO = [
  "Pontuação do Evolue AI de cada closer é acompanhada semanalmente",
  "Volume de reuniões realizadas é acompanhado no dashboard do HubSpot",
  "Contratos assinados e ativados são revisados na quinzena e no mês",
];

export const ATTENTION_M3 = [
  "Perfil de qualificação/disqualificação formal — Um battlecard de disqualificação com critérios objetivos não foi desenvolvido neste módulo. Leads sem fit (ex: Megalabs) consumiram tempo do closer sem critério claro de encerramento.",
  "Script de criação de urgência — Técnicas e scripts específicos para clientes que adiam mesmo com ROI claro foram parcialmente cobertos na seção de objeções, mas merecem aprofundamento próprio.",
  "Battlecard de concorrentes — OmniChat, Zenvia, RD Station, Sirena, Take Blip foram mencionados por clientes nas transcrições. Recomenda-se criar um documento separado com posicionamento da Omni frente a cada concorrente.",
  "Estrutura formal da proposta comercial — O template de ROI da Farma Ponte foi referenciado como modelo, mas um template padrão de proposta comercial completa da Omni não foi desenvolvido neste módulo.",
  "Protocolo de handoff SDR → Closer — O SLA de handoff e o template de brief do SDR pertencem ao Módulo 2, mas impactam diretamente a qualidade do Diagnóstico do Módulo 3.",
  "Valores e tabela de preços completa — Os tiers do TakeFlow (N1 e N2) foram mencionados no contexto de dimensionamento, mas uma tabela comercial completa com todos os produtos (Onvox, Evolue AI, TakeFlow) não foi desenvolvida neste módulo.",
  "Comissionamento do closer — Mencionado como tema do Módulo 5. Recomenda-se alinhar estrutura de comissão com as métricas de KPI definidas neste módulo.",
];

export const MODULE_3_SECTIONS = [
  { id: "m3-sec-1", label: "3.1 Perfil Ideal do Closer" },
  { id: "m3-sec-2", label: "3.2 Ciclo de Vendas" },
  { id: "m3-sec-3", label: "3.3 Campos Obrigatórios HubSpot" },
  { id: "m3-sec-4", label: "3.4 Registro de Atividades" },
  { id: "m3-sec-5", label: "3.5 Reunião 1 — Diagnóstico" },
  { id: "m3-sec-6", label: "3.6 Reunião 2 — Demonstração" },
  { id: "m3-sec-7", label: "3.7 Negociação e Fechamento" },
  { id: "m3-sec-8", label: "3.8 Gestão de Pipeline e CRM" },
  { id: "m3-sec-9", label: "3.9 Métricas e KPIs" },
  { id: "m3-sec-10", label: "Checklist e Pontos de Atenção" },
];
