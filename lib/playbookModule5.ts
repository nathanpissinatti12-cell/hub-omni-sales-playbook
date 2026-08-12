// Conteúdo do Playbook de Vendas Omni Assessoria — Módulo 5 (Pós-venda /
// Customer Success), transcrito de "Omni_Playbook_Modulo5_PosVenda_1.pdf"
// (Versão 1.0, Maio 2025). Conteúdo mantido fiel ao documento original —
// não editorializar processos, métricas ou responsabilidades sem nova fonte.

export const AUDIENCES = [
  {
    title: "👤 Vendedor / Closer",
    desc: "Entender o que acontece depois que você fecha — e como isso impacta sua comissão e reputação.",
  },
  {
    title: "🛠️ Time de Implantação",
    desc: "Ter o processo formalizado e acionável para operar com consistência.",
  },
  {
    title: "📊 Gestor Comercial",
    desc: "Visualizar métricas, riscos e oportunidades de expansão de carteira.",
  },
];

export const GOLDEN_RULE =
  "O vendedor fecha. A unidade de Tatuí implanta, treina e suporta. Essa separação é intencional e é um diferencial competitivo. Ao vendedor cabe acompanhar a satisfação, abrir portas para expansão e repassar feedbacks — não executar a operação técnica.";

// ---------- 5.1 Perfil CS/Implantação ----------

export const CS_COMPETENCIES = [
  ["Comunicação clara e didática", "Explica configurações técnicas para gestores não técnicos"],
  ["Gestão de tempo e múltiplos projetos", "Conduz vários onboardings simultâneos sem perder qualidade"],
  ["Proatividade e antecipação de problemas", "Identifica riscos antes que virem reclamações"],
  ["Conhecimento técnico de telefonia / UCaaS", "Configura ramais, URA, portabilidades, integrações"],
  ["Empatia e orientação ao cliente", "Transmite segurança durante a mudança de sistema"],
  ["Documentação e registro de processos", "Garante rastreabilidade e continuidade de atendimento"],
];

export const POST_SALE_ROLES = [
  ["Implantação", "Configuração, boas-vindas, treinamento inicial, portabilidades", "Unidade Tatuí"],
  ["Suporte Contínuo", "Atendimento de dúvidas, ajustes, novos treinamentos", "Unidade Tatuí"],
  ["Relacionamento comercial", "Satisfação, expansão de conta, indicações", "Closer / Vendedor"],
  ["Gestão de risco de churn", "Identificação de sinais de insatisfação e escalada", "CS + Vendedor"],
];

// ---------- 5.2 Onboarding ----------

export const ONBOARDING_PREMISE =
  "Todo cliente que assina tem direito a um processo de onboarding estruturado, conduzido pela unidade de Tatuí. O vendedor é responsável por fazer o handoff correto e acompanhar a satisfação — não por executar o onboarding.";

export const ONBOARDING_STAGES = [
  {
    title: "ETAPA 1 — Boas-vindas e Alinhamento Inicial",
    responsavel: "Unidade Tatuí",
    prazo: "Até 48h após assinatura do contrato",
    items: [
      "Envio de e-mail/mensagem de boas-vindas ao cliente com apresentação do time de implantação",
      "Agendamento da reunião de kick-off (presencial ou vídeo)",
      "Coleta de informações necessárias: número de ramais, usuários, equipamentos existentes, necessidades especiais",
      "Apresentação do cronograma de implantação com datas e responsáveis",
      "Criação do ticket de implantação no sistema interno",
    ],
  },
  {
    title: "ETAPA 2 — Configuração das Ferramentas Contratadas",
    responsavel: "Unidade Tatuí",
    prazo: "Conforme complexidade (3 a 15 dias úteis)",
    items: [
      "Provisionamento dos ramais e números de telefone",
      "Configuração de URA, filas de atendimento e grupos de toque (conforme contrato)",
      "Integração com ferramentas do cliente (CRM, WhatsApp Business, plataformas de atendimento)",
      "Configuração de gravação de chamadas (quando contratado)",
      "Setup de relatórios e dashboards conforme perfil do cliente",
      "Testes internos antes de apresentar ao cliente",
    ],
  },
  {
    title: "ETAPA 3 — Treinamento com o Cliente",
    responsavel: "Unidade Tatuí",
    prazo: "Após configuração aprovada",
    items: [
      "Treinamento com o gestor/responsável do cliente: visão completa do sistema",
      "Treinamento com os usuários finais: operação do dia a dia",
      "Entrega de material de apoio (manual de uso, vídeos, FAQ)",
      "Sessão de dúvidas ao vivo com o time do cliente",
      "Validação e aprovação formal do cliente ('o sistema está funcionando como esperado?')",
    ],
  },
  {
    title: "ETAPA 4 — Portabilidades e Adequações Contratuais",
    responsavel: "Unidade Tatuí",
    prazo: "Conforme ANATEL (até 30 dias para portabilidade fixa)",
    items: [
      "Abertura do processo de portabilidade junto à operadora atual (quando necessário)",
      "Acompanhamento e comunicação proativa sobre o status da portabilidade",
      "Ajustes de contrato: adição/remoção de linhas, serviços, ramais",
      "Qualquer alteração contratual é gerida integralmente pela unidade de Tatuí",
      "O vendedor NÃO interfere nessa etapa — encaminha ao time de implantação",
    ],
  },
  {
    title: "ETAPA 5 — Go Live e Acompanhamento Pós-implantação",
    responsavel: "Unidade Tatuí + Vendedor",
    prazo: "30 dias após go live",
    items: [
      "Declaração formal de go live: cliente em operação plena",
      "Check-in da equipe de implantação na semana 1 e semana 4",
      "Abertura de canal de suporte contínuo para o cliente",
      "Coleta de NPS / satisfação inicial (primeiros 30 dias)",
      "Revisão do onboarding: o que funcionou, o que ajustar para o próximo",
      "Relatório de entrega encaminhado ao vendedor responsável",
    ],
  },
];

export const ONBOARDING_TIMELINE = [
  ["1 — Boas-vindas", "D+0 a D+2", "Kick-off agendado, cronograma entregue", "Tatuí"],
  ["2 — Configuração", "D+3 a D+10", "Sistema configurado e testado", "Tatuí"],
  ["3 — Treinamento", "D+10 a D+15", "Usuários treinados, material entregue", "Tatuí"],
  ["4 — Portabilidades", "D+5 a D+35", "Números portados e ativos", "Tatuí"],
  ["5 — Go Live + 30d", "D+15 a D+45", "NPS coletado, cliente em operação plena", "Tatuí + Vendedor"],
];

export const HANDOFF_CHECKLIST = [
  "Contrato assinado e identificado corretamente",
  "Nome e contato do responsável técnico no cliente",
  "Nome e contato do gestor de decisão",
  "Número de ramais / usuários contratados",
  "Serviços específicos contratados (gravação, URA, integrações, etc.)",
  "Necessidade de portabilidade? (quais números, operadora atual)",
  "Equipamentos existentes no cliente (headsets, aparelhos IP, etc.)",
  "Prazo de expectativa do cliente para go live",
  "Observações relevantes da negociação (promessas, expectativas especiais)",
  "CRM atualizado com todas as informações acima",
];

// ---------- 5.3 Sucesso por ICP ----------

export const SUCCESS_BY_ICP = [
  ["Empresa com equipe de vendas ativa", "Time ligando mais, com mais produtividade e menos perda de chamada", "Volume de chamadas realizadas, taxa de conexão", "Sistema subutilizado — time não adotou"],
  ["Empresa com SAC / atendimento receptivo", "Redução do tempo de espera, melhora na experiência do cliente final", "TMA, TME, NPS do cliente final", "Configuração de URA ruim, filas mal distribuídas"],
  ["Escritório / profissional liberal", "Nunca mais perder chamada, imagem profissional", "Chamadas atendidas vs perdidas", "Sensação de que 'é igual ao que tinha antes'"],
  ["Empresa em crescimento (scaling)", "Infraestrutura acompanha o crescimento sem fricção", "Novas linhas ativadas em tempo, uptime da plataforma", "Dificuldade de escalar rapidamente"],
  ["Empresa com filiais / múltiplos sites", "Comunicação unificada entre unidades, visibilidade centralizada", "Uso do painel centralizado, chamadas entre ramais", "Integração entre unidades não funciona"],
];

export const SUCCESS_TABLE_USAGE =
  "No kick-off de implantação, pergunte ao cliente: 'Como você vai saber que valeu a pena?' Documente a resposta e use-a como norte para o check-in de 30 dias. Se o resultado esperado não foi alcançado, investigue — isso é um sinal de churn antes do cliente reclamar.";

// ---------- 5.4 Suporte contínuo ----------

export const SUPPORT_INCLUDED = [
  "Atendimento a dúvidas operacionais do cliente (como usar, como configurar)",
  "Novos treinamentos quando necessário (entrada de novos colaboradores, mudanças no time)",
  "Ajustes nas configurações contratadas (adicionar/remover ramais, alterar URA, etc.)",
  "Suporte em caso de falha técnica ou instabilidade",
  "Orientação em processos de portabilidade adicionais",
  "Qualquer necessidade relacionada ao contrato é gerida pelo time de Tatuí",
];

export const SUPPORT_VENDOR_NOT = [
  "O vendedor NÃO deve prometer soluções técnicas ou prazos de configuração.",
  "O vendedor NÃO deve intervir em tickets de suporte — deve encaminhar ao time de Tatuí.",
  "O vendedor NÃO deve fazer ajustes em contas de clientes por conta própria.",
];

export const SUPPORT_ESCALATION_STEPS = [
  "Escute, registre e encaminhe imediatamente para a unidade de Tatuí.",
  "Informe o cliente que o time especializado está sendo acionado.",
  "Acompanhe a resolução e confirme com o cliente que foi atendido.",
];

export const SUPPORT_HANDOFF_SCRIPT_CLIENT =
  "'Entendido, [Nome]. Vou acionar agora o nosso time técnico de Tatuí, que é especializado nisso. Eles já têm o histórico da sua conta e vão te contatar em breve. Posso te passar o contato deles também, mas já estou repassando a situação para agilizar.'";

export const SUPPORT_HANDOFF_INTERNAL_FIELDS = [
  "Nome do cliente e contrato",
  "Descrição do problema reportado",
  "Urgência percebida",
  "Melhor forma de contato com o cliente",
];

// ---------- 5.5 Expansão de conta ----------

export const EXPANSION_TIMING = [
  ["30 dias após go live", "Cliente operando bem, NPS positivo", "Check-in de satisfação + conversa de valor"],
  ["90 dias após go live", "Aumento de volume de uso", "Apresentar upgrade ou solução adicional"],
  ["Renovação contratual", "Cliente ativo e sem reclamações", "Revisão e expansão do pacote"],
  ["Crescimento da empresa", "Cliente contratou mais gente ou abriu nova unidade", "Proposta de expansão de ramais / filiais"],
  ["Reclamação resolvida com sucesso", "Cliente aliviado e satisfeito após problema", "Porta aberta para fortalecer relação"],
];

export const EXPANSION_OPPORTUNITIES = [
  ["Usa telefonia básica", "Adicionar gravação de chamadas", "Qualidade, conformidade e treinamento de equipe"],
  ["Sem URA / atendimento manual", "Configurar URA inteligente", "Reduz carga de atendimento e melhora experiência"],
  ["Usa só ramal fixo", "Adicionar ramal mobile / softphone", "Time em campo continua acessível e produtivo"],
  ["Filial sem integração", "Expandir solução para nova unidade", "Comunicação unificada e painel central"],
  ["WhatsApp pessoal do time", "WhatsApp Business API integrado", "Histórico, controle e atendimento profissional"],
  ["Sem relatórios de atendimento", "Adicionar módulo de analytics", "Gestão baseada em dados, não em intuição"],
];

export const CHECKIN_90D_SCRIPT = {
  abertura: "'Oi, [Nome]! Fazendo meu check-in de rotina. Já faz 3 meses desde que vocês foram ao ar. Como está sendo a experiência no dia a dia?' [Escute. Anote. Valide.]",
  positivo: "'Fico feliz em ouvir isso. Aliás, enquanto conversamos — percebi que vocês estão crescendo bastante. Você tem abertura para a gente explorar como otimizar ainda mais o que vocês têm? Tenho algumas ideias que podem fazer sentido para o momento de vocês.'",
  neutroNegativo: "'Entendo. Deixa eu acionar o time de suporte de Tatuí para resolver isso com agilidade. Assim que estiver resolvido, retomo o contato para garantir que ficou como você esperava.'",
};

// ---------- 5.6 Churn ----------

export const CHURN_SIGNALS = [
  ["🔴", "Cliente não responde check-ins", "Insatisfação silenciosa, distância", "Ligação direta, sem e-mail"],
  ["🔴", "Reclamação não resolvida há >5 dias", "Sensação de abandono", "Escalar para CS sênior + ligar"],
  ["🟡", "Queda brusca no volume de uso", "Time não adotou ou está migrando", "Investigar adoção com usuários finais"],
  ["🟡", "Cliente pergunta sobre portabilidade de saída", "Cotando concorrente ou insatisfeito", "Conversa direta e honesta com o decisor"],
  ["🟡", "NPS < 7 na coleta de 30 dias", "Expectativa não atendida", "Reunião de alinhamento + plano de ajuste"],
  ["🟢", "Pedido de cancelamento formal", "Último aviso — janela estreita", "Escalar para gestor comercial imediatamente"],
];

export const CHURN_ACTION_PLAN = [
  "Identificação: o sinal foi identificado por quem? (vendedor, CS, sistema?)",
  "Registro: abrir alerta no CRM com classificação de risco (baixo / médio / alto)",
  "Diagnóstico: ligar para o cliente (não enviar e-mail) e perguntar diretamente: 'O que está faltando?'",
  "Resolução: acionar o time de Tatuí para resolver a causa técnica (se houver)",
  "Compromisso: definir um plano de ação com prazo e responsável — comunicar ao cliente",
  "Acompanhamento: checar em 48h se o problema foi resolvido",
  "Recuperação: NPS de re-check após resolução",
];

export const CHURN_RISK_SCRIPT =
  "'[Nome], quero ser direto com você. Percebi que não tivemos muito contato ultimamente e quero garantir que tudo está indo bem com a nossa solução. Você tem 10 minutos para me falar o que está funcionando e o que poderia estar melhor? Prefiro ouvir de você do que descobrir depois.' Não defenda o produto — escute. Pergunte, registre e aja.";

// ---------- 5.7 KPIs ----------

export const KPI_IMPLANTACAO = [
  ["Tempo de kick-off", "Dias entre assinatura e 1ª reunião", "≤ 2 dias úteis", "Por contrato"],
  ["Tempo de go live", "Dias entre assinatura e operação plena", "≤ 15 dias úteis", "Por contrato"],
  ["NPS de onboarding (30d)", "Pesquisa de satisfação aos 30 dias", "≥ 8,0", "Mensal"],
  ["Taxa de handoff completo", "Contratos com checklist 100% preenchido", "≥ 95%", "Mensal"],
];

export const KPI_SUPORTE_RETENCAO = [
  ["Churn rate mensal", "Contratos cancelados / base ativa", "< 2%", "Mensal"],
  ["Net Revenue Retention (NRR)", "(MRR início + expansões - churns) / MRR início", "≥ 105%", "Trimestral"],
  ["CSAT de suporte", "% clientes satisfeitos após atendimento", "≥ 90%", "Mensal"],
  ["Tempo médio de resolução (TMR)", "Horas entre abertura e fechamento do ticket", "≤ 24h úteis", "Semanal"],
  ["Clientes com risco de churn ativo", "Abertos no CRM com flag 'risco'", "< 5% da base", "Semanal"],
];

export const KPI_EXPANSAO = [
  ["Taxa de upsell", "Clientes com expansão / base ativa", "≥ 15% ao trimestre", "Trimestral"],
  ["MRR de expansão", "Receita adicional de clientes existentes", "Crescimento MoM positivo", "Mensal"],
  ["Indicações geradas", "Novos leads vindos de clientes ativos", "≥ 2 por trimestre por CS", "Trimestral"],
];

// ---------- Checklist de implementação ----------

export const CHECKLIST_PROCESSOS_ESTRUTURA = [
  "Processo de onboarding das 5 etapas documentado e comunicado ao time de Tatuí",
  "Checklist de handoff (vendedor → implantação) disponível no CRM",
  "Template de e-mail de boas-vindas criado e padronizado",
  "Canal de comunicação interno entre vendedores e time de Tatuí definido",
  "Responsável pelo pós-venda em Tatuí designado e apresentado ao time comercial",
];

export const CHECKLIST_METRICAS_FERRAMENTAS = [
  "Dashboard de KPIs de pós-venda criado (NPS, churn, TMR, expansão)",
  "Pesquisa de NPS de 30 dias configurada e automatizada",
  "CRM com campos de 'risco de churn' e 'oportunidade de expansão' configurados",
  "Processo de abertura de tickets de suporte documentado e treinado",
];

export const CHECKLIST_TREINAMENTO_COMERCIAL = [
  "Vendedores treinados sobre o que é papel deles vs papel do Tatuí",
  "Script de encaminhamento de problemas técnicos disponível para o time",
  "Playbook de check-in (30, 90 dias) treinado e incorporado à rotina",
  "Critérios de sinais de churn comunicados e cobrados em reuniões de pipeline",
];

export const CHECKLIST_CULTURA_RITUAIS = [
  "Reunião mensal de revisão de churn e expansão agendada",
  "Processo de reconhecimento quando cliente indica novo cliente",
  "Feedback loop entre CS/Tatuí e time comercial funcionando (semanal ou quinzenal)",
  "Treinamento de novos CSs e implantadores inclui este módulo como referência",
];

// ---------- Origem das práticas ----------

export const ORIGIN_OMNI_M5 = [
  "Modelo de centralização do pós-venda na unidade de Tatuí — estrutura real e operante",
  "Separação clara de responsabilidades: vendedor fecha, Tatuí implanta e suporta",
  "Processo completo de onboarding incluindo portabilidades e treinamentos personalizados",
  "Suporte humanizado e especializado como diferencial competitivo frente a operadoras",
];

export const ORIGIN_EXTERNAL_M5 = [
  "Framework de Early Warning Signals para churn — inspirado em práticas da Zendesk e Gainsight",
  "Conceito de NRR (Net Revenue Retention) como métrica de saúde de carteira — usado amplamente por SaaS B2B (HubSpot, Twilio, Salesforce)",
  "Playbook de expansão de conta com timing definido (30/90 dias) — adaptado do modelo de Customer Success da Salesforce",
  "Tabela de definição de sucesso por perfil de cliente (ICP) — inspirada na abordagem de Outcome-Based CS da Gainsight",
  "Separação de papéis CS vs Vendedor na expansão — best practice de empresas como GoTo e RingCentral em UCaaS",
];

export const MODULE_5_SECTIONS = [
  { id: "m5-sec-1", label: "5.1 Perfil CS / Implantação" },
  { id: "m5-sec-2", label: "5.2 Processo de Onboarding" },
  { id: "m5-sec-3", label: "5.3 Sucesso por Perfil (ICP)" },
  { id: "m5-sec-4", label: "5.4 Suporte Contínuo" },
  { id: "m5-sec-5", label: "5.5 Expansão de Conta" },
  { id: "m5-sec-6", label: "5.6 Risco de Churn" },
  { id: "m5-sec-7", label: "5.7 Métricas e KPIs" },
  { id: "m5-sec-8", label: "Checklist e Origem das Práticas" },
];
