// Conteúdo do Playbook de Vendas Omni Assessoria — Módulo 6 (Cultura,
// Gestão e Rituais Comerciais), transcrito de
// "Omni_Playbook_Modulo6_Cultura_Gestao.pdf" (Versão 1.0, Maio 2026).
// Conteúdo mantido fiel ao documento original — não editorializar valores,
// rituais ou critérios sem nova fonte.

// ---------- 6.1 Cultura ----------

export const CULTURE_PILLARS = [
  {
    title: "Consultoria antes de venda",
    text: "O time não vende software. Vende diagnóstico e resultado. Esse princípio precisa estar internalizado em cada função — do BDR que faz a primeira ligação ao CS que conduz o check-in de 90 dias. Quando o time começa a pensar em \"bater a meta\" antes de pensar em \"resolver o problema do cliente\", a cultura está sendo corroída.",
  },
  {
    title: "Dado é argumento",
    text: "A Omni usa evolu.AI para auditar 100% das interações, Meetime para trackear esforço e HubSpot para mapear o pipeline. Não existe \"achismo\" na gestão. Feedback sem dado é opinião. Decisão sem dado é aposta.",
  },
  {
    title: "Próximo passo sempre",
    text: "Nenhuma interação — interna ou com cliente — termina sem próximo passo concreto, datado e com responsável. Isso vale para reunião de pipeline, 1:1, cold call e reunião de diagnóstico. É o DNA operacional da Omni.",
  },
  {
    title: "Crescimento com responsabilidade",
    text: "O time cresce porque o cliente cresce. Upsell e expansão não são métricas de pressão — são consequências naturais de um cliente que está tendo resultado. Quando a cultura está saudável, o cliente pede mais antes do vendedor oferecer.",
  },
];


// ---------- 6.4 Rituais ----------

export type Ritual = {
  title: string;
  cadence: string;
  audience: string;
  agenda: string[];
  goldenRule: string;
};

export const RITUALS: Ritual[] = [
  {
    title: "Daily",
    cadence: "15 minutos, todo dia útil, 9h",
    audience: "Time de BDR e Closers (separados ou juntos, dependendo do porte do time). Formato: de pé, sem apresentação, rápido.",
    agenda: [
      "Cada membro responde 3 perguntas em até 2 minutos: O que fiz ontem? O que farei hoje? Tem algum bloqueio?",
      "Gestor registra bloqueios e resolve fora da daily",
      "Nada de análise de pipeline na daily — isso vai para o pipeline review",
    ],
    goldenRule: "Daily que passa de 20 minutos virou reunião. Terminar na hora é responsabilidade do gestor, não do time.",
  },
  {
    title: "Pipeline Review Semanal",
    cadence: "60 minutos, toda segunda-feira",
    audience: "Gestor + Closers. Formato: HubSpot aberto na tela. Card por card nos negócios em andamento.",
    agenda: [
      "Negócios em negociação — status, próximo passo e data",
      "Negócios em demonstração — o que está travando a evolução?",
      "Negócios sem atividade há mais de 7 dias — o que aconteceu?",
      "Forecast da semana — o que fecha essa semana com alta confiança?",
      "O que o gestor avalia em cada card: há próximo passo com data definida? O decisor real está identificado? O ROI foi apresentado? O campo de temperatura está atualizado?",
    ],
    goldenRule: "Qualquer card sem próximo passo datado é marcado como risco imediato. O closer tem até a daily de terça para atualizar.",
  },
  {
    title: "Review de BDR Semanal",
    cadence: "45 minutos, toda sexta-feira",
    audience: "Gestor + Time de BDR. Formato: Dashboard do Meetime aberto. KPIs da semana na tela.",
    agenda: [
      "Minutos falados na semana — quem está abaixo de 200 minutos?",
      "SALs geradas na semana — qualidade e volume",
      "Top 3 ligações da semana — ouvir trechos ao vivo com feedback do evolu.AI",
      "Objeção nova que apareceu — como o time respondeu?",
      "Plano da semana seguinte — fila priorizada por A/B/C",
    ],
    goldenRule: "Ouvir ligações em grupo não é punição — é desenvolvimento. Criar cultura de que feedback em grupo é normal elimina a resistência ao evolu.AI.",
  },
  {
    title: "1:1 Individual",
    cadence: "30 minutos, quinzenal por colaborador",
    audience: "Gestor + cada membro do time individualmente.",
    agenda: [
      "Como está você? (5 minutos — genuíno, não protocolar)",
      "O que está indo bem na sua operação? (10 minutos)",
      "Onde você está travado ou precisando de ajuda? (10 minutos)",
      "Que compromisso você leva dessa conversa? (5 minutos)",
      "O que NÃO é o 1:1: não é revisão de meta (isso vai para o pipeline review); não é feedback negativo acumulado (deve ser dado na hora, não guardado); não é monólogo do gestor (se o gestor fala mais de 40% do tempo, a reunião falhou)",
    ],
    goldenRule: "O 1:1 é o principal instrumento de retenção de talentos. Time que não tem 1:1 consistente é time que não sente que a empresa se importa com seu desenvolvimento.",
  },
  {
    title: "Forecast Mensal",
    cadence: "90 minutos, última semana do mês",
    audience: "Gestor Comercial + Liderança da Omni. Formato: apresentação estruturada com HubSpot + planilha de forecast.",
    agenda: [
      "Performance do mês — real vs. meta (BDR e Closers separados)",
      "Análise de pipeline — o que está em negociação para o próximo mês?",
      "Forecast do próximo mês — três cenários: pessimista, realista, otimista",
      "Principais riscos — deals que podem cair e por quê",
      "Ações corretivas — o que muda no processo para o próximo mês?",
    ],
    goldenRule: "Forecast não é chute — é compromisso com base em dados. Gestor que erra o forecast por mais de 30% por dois meses consecutivos precisa revisar seu método de análise de pipeline.",
  },
  {
    title: "QBR — Quarterly Business Review",
    cadence: "A cada trimestre (meio dia)",
    audience: "Time Comercial completo + Liderança da Omni.",
    agenda: [
      "Resultado do trimestre — BDR, Closers e CS",
      "O que funcionou — práticas que geraram resultado e devem ser mantidas",
      "O que não funcionou — o que precisa mudar no processo, não nas pessoas",
      "Reconhecimento — top performers do trimestre com critérios claros",
      "Próximas metas — definição colaborativa das metas do próximo trimestre",
      "Atualização do playbook — o que aprendemos que deve ser registrado?",
    ],
    goldenRule: "O QBR é o momento mais estratégico do calendário comercial. Não pode ser cancelado, não pode ser reduzido a 1 hora e não pode ser só a liderança falando. Time que não participa da construção das metas não se compromete com elas.",
  },
];

// ---------- 6.5 Metas e comissionamento ----------

export const COMP_PRINCIPLES = [
  {
    title: "Clareza acima de tudo",
    text: "O vendedor precisa conseguir calcular sua própria comissão sem precisar perguntar para o RH. Se o modelo é complexo, o time não confia nele — e sem confiança no modelo, a motivação cai.",
  },
  {
    title: "Esforço + resultado",
    text: "Não existe só comissão por fechamento — existe também reconhecimento de esforço de qualidade (score evolu.AI, handoffs bem feitos, atividades no Meetime). Isso cria cultura de processo, não só de resultado final.",
  },
  {
    title: "Acelerador para quem supera",
    text: "Quem supera a meta ganha um multiplicador maior. Quem fica abaixo de 70% não recebe bônus — mas não é penalizado no fixo.",
  },
];

export const CLOSER_PERFORMANCE_TIERS = [
  ["Faixa 0", "< 70%", "0x", "Sem bônus — foco em desenvolvimento"],
  ["Faixa 1", "70–99%", "0,7x", "Bônus parcial proporcional"],
  ["Faixa 2", "100%", "1,0x", "Meta cheia = bônus cheio"],
  ["Faixa 3", "110–130%", "1,5x", "Acelerador"],
  ["Faixa 4", "131–160%", "2,0x", "Acelerador forte"],
  ["Faixa 5", "160%+", "3,0x", "Acelerador máximo — raro e celebrado"],
];

export const BDR_GOAL_NOTE =
  "Meta de SALs mensais definida por nível (Blue/Gold/Black/Platinum), com modelo OTE (On-Target Earnings) e multiplicadores por faixa de atingimento.";

export const OTE_FAIXAS = [
  { faixa: "Faixa 0", pct: "< 70%", leads: "< 14", mult: "0x", bonus: "R$ 0", total: "R$ 4.000" },
  { faixa: "Faixa 1", pct: "70%", leads: "14", mult: "0,6x", bonus: "R$ 600", total: "R$ 4.600" },
  { faixa: "Faixa 2", pct: "100% (meta)", leads: "20", mult: "1,0x", bonus: "R$ 1.000", total: "R$ 5.000" },
  { faixa: "Faixa 3", pct: "140%", leads: "28", mult: "1,6x", bonus: "R$ 1.600", total: "R$ 5.600" },
  { faixa: "Faixa 4", pct: "180%", leads: "36", mult: "2,3x", bonus: "R$ 2.300", total: "R$ 6.300" },
  { faixa: "Faixa 5", pct: "200%+", leads: "40+", mult: "3,3x", bonus: "R$ 3.300", total: "R$ 7.300" },
];

export const CS_VARIABLE_METRICS = [
  "NPS de onboarding (média do time)",
  "Churn rate da base",
  "Taxa de expansão (upsell gerado)",
  "Tempo médio de go live",
];

export const MANAGER_COMP_NOTE =
  "Meta atrelada ao resultado do time — não ao resultado individual. A remuneração variável do gestor é calculada sobre o resultado consolidado de BDR + Closers contra a meta da operação.";

export const COMP_GOLDEN_RULES = [
  "Nunca mude as regras no meio do mês. Qualquer mudança entra no início do próximo mês, comunicada com pelo menos 2 semanas de antecedência.",
  "Pague em dia. Atraso no pagamento de comissão é o caminho mais rápido para perder um bom vendedor.",
  "Comunique o modelo por escrito. O vendedor assina o modelo de comissão antes de começar.",
];

// ---------- 6.6 Ramp-up ----------

export const RAMPUP_INTRO =
  "Um novo vendedor sem onboarding estruturado leva de 30% a 50% mais tempo para atingir a primeira meta. Se ele não entende o produto, a cultura e o processo nos primeiros 30 dias, as chances de ele sair nos primeiros 3 meses sobem drasticamente.";

export const BDR_RAMPUP_WEEK1 = [
  ["D1", "Boas-vindas, apresentação do time, acesso às ferramentas"],
  ["D2", "Imersão na Omni: história, posicionamento, produtos, clientes, concorrentes"],
  ["D3–4", "Treinamento técnico: TakeFlow, Onvox, evolu.AI — como funcionam, para quem e por quê"],
  ["D5", "Módulo 1 do Playbook: posicionamento, ICP, narrativa, objeções"],
];

export const BDR_RAMPUP_WEEK1_PIPELOVERS =
  "Inscrever o novo BDR no grupo de Pré-Vendedores da Pipelovers. A imersão na comunidade já começa com benchmarking de peers e acesso às aulas de cold call e cadência.";

export const BDR_RAMPUP_WEEK2 = [
  ["Shadow de 20 ligações", "Ouvir BDR Black ou Platinum em operação real — sem interferir"],
  ["Roleplay da Abordagem Oficial", "Mínimo 5 sessões gravadas com feedback do evolu.AI"],
  ["Treinamento Meetime", "Cadências, Dialer, Fit Score, registro de SAL"],
  ["Treinamento GPCT_BA_C&I", "Aplicação prática por produto com roleplay"],
];

export const BDR_RAMPUP_WEEK3 =
  "O BDR começa a discar com madrinha ou padrinho ao lado — BDR sênior disponível para consultar em tempo real. Meta de 50% do volume padrão. Feedback diário do gestor via evolu.AI.";

export const BDR_RAMPUP_WEEK4 =
  "BDR opera de forma independente. Gestor faz análise de 5 ligações no evolu.AI com feedback escrito. Avaliação formal ao final da semana.";

export const BDR_RAMPUP_AFTER =
  "Do dia 31 em diante: Meta cheia. Feedback semanal via evolu.AI. 1:1 quinzenal com gestor.";

export const CLOSER_RAMPUP_WEEK1_2 = [
  ["Imersão nos produtos", "Demo ao vivo de TakeFlow, Onvox e evolu.AI — entender como usar, não só vender"],
  ["Leitura dos Módulos 1, 3 e 4", "Posicionamento, ciclo de vendas e precificação"],
  ["Shadow de 3 reuniões de diagnóstico", "Observar closer sênior conduzindo — anotar tudo"],
  ["Shadow de 2 reuniões de demonstração", "Idem"],
  ["Treinamento HubSpot", "Pipeline, campos obrigatórios, registro de atividades"],
];

export const CLOSER_RAMPUP_WEEK3_4 =
  "O novo closer conduz reuniões de diagnóstico com o closer sênior presente como apoio. Após cada reunião, análise via evolu.AI com feedback estruturado. Meta: 3 diagnósticos conduzidos com aprovação do sênior.";

export const CLOSER_RAMPUP_WEEK5_6 =
  "Opera sozinho com meta de 50% do volume padrão. Gestor revisa todo card no HubSpot antes de qualquer proposta ser enviada.";

export const CLOSER_RAMPUP_AFTER =
  "Do dia 46 em diante: Meta cheia. Pipeline review semanal padrão. Análise de evolu.AI semanal.";

export const CLOSER_RAMPUP_G4 =
  "A Trilha de Vendas do G4 Skills (3 níveis) serve como formação contínua paralela ao ramp-up. O gestor define quais módulos são obrigatórios nos primeiros 45 dias. O dashboard do G4 Skills mostra o progresso individual sem precisar perguntar.";

// ---------- 6.7 Ferramentas ----------

export const TOOL_STACK = [
  ["Meetime Flow", "Principal", "—", "—", "Dashboard"],
  ["HubSpot", "Registro de SAL", "Pipeline", "Pós-venda", "Forecast"],
  ["evolu.AI", "Ligações analisadas", "Reuniões analisadas", "—", "Dashboard"],
  ["LinkedIn Sales Navigator", "Prospecção", "Pesquisa", "—", "—"],
  ["Google Meet", "—", "Reuniões", "Onboarding", "Gestão"],
  ["WhatsApp Business", "Cadência", "Follow-up", "Suporte", "—"],
];

export const PIPELOVERS_PRACTICE = [
  "BDRs: inscritos no grupo de Pré-Vendedores — acesso a 5 aulas ao vivo por semana com especialistas seniores, benchmarking com outros BDRs de empresas B2B de todo o Brasil",
  "Closers: inscritos no grupo de Executivos de Vendas — foco em técnica consultiva, condução de reunião executiva e fechamento",
  "Gestores: acesso à Academia B2B da Pipelovers — programa presencial de formação de liderança comercial com foco em rituais de gestão, playbook e RevOps",
];

export const PIPELOVERS_ROUTINE =
  "O gestor indica pelo menos 1 aula por semana como obrigatória no ritual de sexta. Na semana seguinte, o BDR apresenta em 3 minutos o que aprendeu e como aplicou. Isso cria accountability sem burocracia.";

export const G4_SKILLS_PRACTICE = [
  "Diagnóstico de maturidade individual por IA: cada colaborador recebe um plano de desenvolvimento personalizado com base em gaps identificados — não um currículo genérico",
  "Trilha de Vendas (3 níveis): estruturada do vendedor iniciante ao especialista em estratégias avançadas",
  "Dashboard de progresso: gestor acompanha consumo, engajamento e evolução de cada membro sem precisar perguntar",
  "Conteúdo proprietário: a Omni pode adicionar seus próprios módulos na plataforma — treinamentos internos, onboarding de produtos, manual de processo",
];

export const PIPELOVERS_VS_G4 = [
  ["Aulas ao vivo semanais com especialistas externos", "Trilhas assíncronas e personalizadas por IA"],
  ["Benchmarking com outros profissionais do mercado", "Desenvolvimento interno com conteúdo da Omni"],
  ["Comunidade e networking B2B", "Dashboard de progresso individual para o gestor"],
  ["Foco em BDR e Closer", "Foco em Closer e Gestor"],
];

// ---------- 6.8 Reconhecimento ----------

export const RECOGNITION_INTRO =
  "Reconhecimento não é só dinheiro. Time que só recebe feedback quando erra aprende a esconder o que vai mal. Time que recebe reconhecimento quando acerta replica o comportamento.";

export const RECOGNITION_MECHANISMS = [
  {
    title: "Top BDR do Mês",
    text: "O BDR com maior combinação de volume + qualidade (SALs geradas × score evolu.AI) recebe reconhecimento público no ritual de gestão e tem o nome fixado no dashboard do time pelo mês seguinte.",
  },
  {
    title: "Top Closer do Trimestre",
    text: "Closer com resultado acima de 130% da meta por trimestre recebe reconhecimento formal no QBR — com narrativa do que fez diferente, não só o número.",
  },
  {
    title: "Ligação da Semana",
    text: "A cada sexta, o gestor escolhe a melhor ligação da semana no evolu.AI e toca um trecho para o time com comentário positivo específico. Isso reforça comportamento correto de forma pública e sem constrangimento.",
  },
  {
    title: "Indicação de Carreira",
    text: "BDR que atinge Platinum e demonstra perfil consultivo tem conversa formal com o gestor sobre transição para Closer — não espera que a oportunidade apareça por acaso.",
  },
];

export const PERFORMANCE_AVOID = [
  {
    title: "Não ranking só por número",
    text: "Ranking que mostra só quem fechou mais ignora quem teve ciclo mais difícil, quem gerou melhor qualidade de lead ou quem desenvolveu mais. Ranking multidimensional é mais justo e mais motivador.",
  },
  {
    title: "Não feedback só negativo",
    text: "Equipe que só recebe feedback quando erra desenvolve cultura defensiva. Ratio recomendado: 3 feedbacks positivos para cada 1 corretivo.",
  },
  {
    title: "Não meta impossível",
    text: "Meta que ninguém atinge não motiva — desmotiva. Se menos de 30% do time atingiu a meta no mês, o problema não é o time — é a meta ou o processo. Revisar antes de cobrar mais.",
  },
];

// ---------- 6.9 Checklist ----------

export const CHECKLIST_SETUP_INICIAL = [
  "Modelo de comissionamento de BDR e Closer documentado por escrito e assinado por todos",
  "Calendário de rituais criado no Google Calendar com recorrência — daily, pipeline review, review BDR, 1:1, forecast mensal, QBR trimestral",
  "HubSpot com campos obrigatórios por etapa configurados (conforme Módulo 3)",
  "Meetime Flow com cadências, Fit Score e campos de SAL configurados (conforme Módulo 2)",
  "evolu.AI integrada ao Meetime Dialer e ao Google Meet — análise automática ativa",
  "Pipelovers: licenças contratadas e time inscrito nos grupos corretos por função",
  "G4 Skills: plataforma configurada com trilhas definidas por função e conteúdo interno da Omni adicionado",
  "Plano de carreira documentado e comunicado ao time",
];

export const CHECKLIST_ONBOARDING_COLABORADOR = [
  "Acesso a todas as ferramentas configurado antes do primeiro dia",
  "Madrinha ou padrinho designado",
  "Trilha obrigatória no G4 Skills mapeada antes da chegada",
  "Inscrição na Pipelovers no grupo correto",
  "Cronograma de ramp-up enviado ao colaborador no primeiro dia",
  "Avaliação formal agendada para o D30 e D45",
];

export const CHECKLIST_RITUAIS_MENSAL = [
  "Daily está sendo realizada todos os dias úteis e não está passando de 20 minutos?",
  "Pipeline review está gerando próximos passos concretos em todos os cards?",
  "Review de BDR está incluindo escuta de ligações ao vivo com feedback?",
  "1:1 individual está acontecendo quinzenalmente com todos?",
  "Forecast mensal está sendo preparado com dados, não com intuição?",
  "QBR trimestral está gerando atualização do playbook?",
];

export const CHECKLIST_CULTURA_SAUDE = [
  "Menos de 20% do time está abaixo de 70% da meta por mais de 2 meses consecutivos?",
  "Taxa de turnover do time comercial está abaixo de 25% ao ano?",
  "Feedback positivo : corretivo está em pelo menos 2:1 nos rituais de gestão?",
  "O playbook foi atualizado pelo menos uma vez nos últimos 90 dias com aprendizados reais?",
];

// ---------- 6.10 Pontos de atenção ----------

export const ATTENTION_M6 = [
  "Valores exatos de fixo e bônus do Closer: o modelo de estrutura de comissionamento foi formalizado, mas os valores absolutos de fixo, bônus e OTE do Closer dependem de decisão da liderança com base na margem atual dos produtos. Isso precisa ser definido antes de qualquer contratação ou revisão salarial.",
  "Critérios formais de progressão entre níveis de BDR: a progressão é holística, não quantitativa. Para evitar percepção de arbitrariedade, recomenda-se criar uma rubrica de avaliação com critérios explícitos — mesmo que ponderados, não binários.",
  "Integração do G4 Skills com conteúdo interno: a plataforma permite adicionar módulos próprios da Omni. Requer dedicação de tempo para produção inicial do conteúdo — oportunidade de centralizar todos os treinamentos internos em um único lugar.",
  "Definição de ticket mínimo para o time de Closers: sem esse critério, Closers podem gastar tempo em negócios de baixo valor que deveriam ser redirecionados ou encerrados mais cedo.",
  "Processo de desligamento de colaborador: não foi desenvolvido neste módulo um protocolo de desligamento que proteja o relacionamento com o cliente, transfira o pipeline com qualidade e mantenha o moral do time. Recomenda-se criar esse processo antes que a primeira situação apareça.",
  "Integração entre Pipelovers e evolu.AI: criar um ciclo formal onde o score do evolu.AI alimenta o plano de desenvolvimento na Pipelovers — por exemplo: score baixo em contorno de objeções na semana → aula específica indicada para a semana seguinte. Isso seria um diferencial de gestão de alta performance.",
];

export const MODULE_6_SECTIONS = [
  { id: "m6-sec-1", label: "6.1 Cultura Comercial" },
  { id: "m6-sec-4", label: "6.4 Rituais de Gestão" },
  { id: "m6-sec-5", label: "6.5 Metas e Comissionamento" },
  { id: "m6-sec-6", label: "6.6 Ramp-up de Novos Vendedores" },
  { id: "m6-sec-7", label: "6.7 Ferramentas por Função" },
  { id: "m6-sec-8", label: "6.8 Reconhecimento e Performance" },
  { id: "m6-sec-9", label: "6.9 Checklist de Implementação" },
  { id: "m6-sec-10", label: "6.10 Pontos de Atenção" },
];
