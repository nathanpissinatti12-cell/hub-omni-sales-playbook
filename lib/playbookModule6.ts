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

export const MODULE_6_SECTIONS = [
  { id: "m6-sec-1", label: "6.1 Cultura Comercial" },
  { id: "m6-sec-5", label: "6.5 Metas e Comissionamento" },
  { id: "m6-sec-6", label: "6.6 Ramp-up de Novos Vendedores" },
  { id: "m6-sec-7", label: "6.7 Ferramentas por Função" },
  { id: "m6-sec-9", label: "6.9 Checklist de Implementação" },
];
