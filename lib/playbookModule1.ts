// Conteúdo do Playbook de Vendas Omni Assessoria — Módulo 1 (Fundação
// Estratégica), transcrito de "Omni_Playbook_Modulo1_Fundacao_Estrategica.pdf"
// (baseado em: Apresentação Omni Assessoria + PAR OnVox & TakeFlow, Vinteo
// 2026). Conteúdo mantido fiel ao documento original — não editorializar
// números, nomes de clientes ou scripts sem nova fonte.

export const NAO_DIZER = [
  {
    naoDizer: "Somos um sistema de PABX em nuvem",
    porque: "Commoditiza. O prospect vai pedir preço por ramal.",
    dizer: "Somos uma plataforma de comunicação unificada com IA — telefonia é só uma das camadas",
  },
  {
    naoDizer: "Nossa solução é mais barata",
    porque: "Race to the bottom. Atraí cliente errado.",
    dizer: "Nosso custo total é menor porque eliminamos desperdício — e provamos com dados",
  },
  {
    naoDizer: "Somos uma revenda da Yeastar",
    porque: "Destrói percepção de valor agregado e tecnologia própria.",
    dizer: "Usamos parceria tecnológica internacional como infraestrutura, mas o ecossistema é nosso",
  },
  {
    naoDizer: "Temos um WhatsApp corporativo",
    porque: "Parece commodity. Centenas de concorrentes dizem o mesmo.",
    dizer: "Nossa plataforma unifica atendimento, IA de triagem e gestão em tempo real — integrado ao seu CRM",
  },
];

export type Icp = {
  id: string;
  name: string;
  referencias: string;
  dor: string;
  gatilho: string;
  abertura: string;
  proposta: string;
  provaSocial: string;
  decisorEconomico: string;
  compradorTecnico?: string;
  promotorInterno: string;
};

export const ICPS: Icp[] = [
  {
    id: "icp-1",
    name: "ICP 1 — Operadores de Logística e Distribuição",
    referencias: "Patrus Transportes, Comando Diesel, Hipercon Cargas, Movecta, Delpak Embalagens",
    dor: "Sede não sabe o que acontece no pátio, terminal ou caminhão em tempo real. Telefone é a cola entre o escritório e a operação distribuída.",
    gatilho: "Empresa com 2+ endereços físicos e mais de 20 ramais. Usa PABX físico ou celulares avulsos sem controle.",
    abertura: "\"Como sua sede fica sabendo, em tempo real, o que está acontecendo nos seus terminais?\"",
    proposta: "Unificação de todos os pontos da operação em uma plataforma com ramal em nuvem, gravação de chamadas, dashboard e mobilidade — sem hardware preso em galpão.",
    provaSocial: "Comando Diesel, Hipercon Cargas — coordenação de fluxo em tempo real. Neobetel: -20% em telefonia, -80% na linha 0800.",
    decisorEconomico: "Dono / CFO — custo fixo + risco operacional",
    compradorTecnico: "Gerente de TI ou Coord. de Infraestrutura — estabilidade, API, integração CRM",
    promotorInterno: "Supervisor comercial ou gerente de operações — quer produtividade e dados",
  },
  {
    id: "icp-2",
    name: "ICP 2 — Consultoria de Alto Toque e Vendas Complexas",
    referencias: "Opus Viagens, Maiorca Passagens, Lemmo Seguros, Pride Consultoria, British Council, ActionAid",
    dor: "Fechamento de contratos de alto ticket exige voz profissional, gravação para segurança jurídica e URA que transmita autoridade. Telefone informal queima credibilidade.",
    gatilho: "Empresa com ticket médio alto, venda consultiva e necessidade de auditoria de atendimento.",
    abertura: "\"Quando seu consultor fecha uma negociação de alto valor por telefone, você consegue ouvir depois como foi essa ligação?\"",
    proposta: "Gravação de 100% das chamadas, URA profissional, auditoria cognitiva com IA — para que o gestor saiba exatamente como o time está vendendo e atendendo.",
    provaSocial: "British Council: parceria de 5+ anos, redução de custos e melhoria de infraestrutura. Lemmo Seguros: atendimento em alto volume com ramal profissional.",
    decisorEconomico: "Dono / Diretor Geral — reputação + custo operacional",
    promotorInterno: "Gerente comercial ou supervisor de atendimento",
  },
  {
    id: "icp-3",
    name: "ICP 3 — Indústria e Comércio B2B com Cadeia de Suprimentos",
    referencias: "Niazitex (Têxtil), Indusparquet (Madeiras), Biguá (Auto Peças), Têxtil Beira Rio",
    dor: "Times de inside sales ligam o dia todo para revendedores. Sem integração da telefonia ao CRM, os dados de ligação se perdem e o gestor não tem visibilidade.",
    gatilho: "Empresa com balanção de vendas internas, usa HubSpot/Bitrix e reclama que o vendedor não registra o que fala no telefone.",
    abertura: "\"Seu time de vendas internas liga o dia todo — mas você consegue ver quantas ligações foram feitas, o tempo médio e quem está prospectando mais?\"",
    proposta: "Click-to-call integrado ao CRM, relatórios de produtividade por vendedor, gravação automática — para que o gestor transforme dados de ligação em inteligência comercial.",
    provaSocial: "Comvem: -40% em telefonia móvel. Niazitex e Indusparquet: times de inside sales com telefonia unificada.",
    decisorEconomico: "Gerente de TI (técnico) + Diretor Comercial (usuário)",
    promotorInterno: "Supervisor de vendas internas — quer relatórios e dados",
  },
  {
    id: "icp-4",
    name: "ICP 4 — Gestão de Comunidade e Atendimento de Massa",
    referencias: "AFAM (166 ramais), Renovação Cariasmática Católica, CREASP, OAB-SP",
    dor: "Milhares de associados ou membros que precisam de atendimento centralizado. URA única para múltiplas unidades. Alto volume de chamadas ativas (campanhas de engajamento e arrecadação).",
    gatilho: "Entidades com 100+ ramais e estrutura de SAC para associados. Alta dependência de saída de chamadas.",
    abertura: "\"Com mais de [X] associados para atender, como vocês garantem que ninguém fica sem resposta e o custo de telefonia não escapa do orçamento?\"",
    proposta: "URA unificada, filas de atendimento, callback automático, relatórios de volume — tudo na nuvem, sem hardware físico por unidade.",
    provaSocial: "AFAM: 166 ramais implantados. Renovação Cariasmática: campanhas de saída em larga escala.",
    decisorEconomico: "Diretor administrativo / Tesoureiro — custo + escala",
    promotorInterno: "Coordenador de TI ou responsável pelo atendimento",
  },
  {
    id: "icp-5",
    name: "ICP 5 — Digitais com Alta Demanda Inbound (TakeFlow ICP)",
    referencias: "Teddework Imobiliária, Corretora Viver, G4 Educação, Diego Bernardo Advogados, Cony Services, FS Tatuí Securitizadora",
    dor: "Investem em Meta/Google Ads e perdem até 60% dos leads por demora no WhatsApp ou falta de triagem. A IA da TakeFlow qualifica instantaneamente e distribui para o closer certo.",
    gatilho: "Empresa com anúncios ativos no Meta/Google, time com SDR + Closer, uso de CRM (HubSpot/Bitrix) e múltiplos números de WhatsApp sem gestão centralizada.",
    abertura: "\"Você investe em anúncios e os leads chegam no WhatsApp — mas quanto tempo leva para seu time responder o primeiro contato? A cada minuto a mais, você perde conversão.\"",
    proposta: "Plataforma multi-número unificada com chatbot de IA para triagem em segundos, passagem de bastão SDR→Closer dentro da plataforma e integração nativa ao CRM. Fim do lead esquecido.",
    provaSocial: "Taxa de conversão de 70% na base quando o lead já pertence ao grupo. Teddework, Corretora Viver: triagem instantânea de leads inbound.",
    decisorEconomico: "Diretor de Marketing ou Head de Vendas — ROI de anúncios",
    compradorTecnico: "Gerente de Operações ou Desenvolvedor — API aberta, integração CRM, segurança de dados",
    promotorInterno: "SDR líder ou Head de Marketing — quer escalar volume de agendamentos",
  },
];

export const DECISION_MAP = [
  {
    papel: "Comprador Econômico",
    onvox: "Dono / CFO",
    takeflow: "Diretor de Marketing ou Head de Vendas",
    importa: "Custo total, ROI, redução de custo fixo, previsibilidade orçamentária",
  },
  {
    papel: "Comprador Usuário",
    onvox: "Supervisores de Vendas, Gestores de Operação, Recepcionistas",
    takeflow: "SDRs, Atendentes de SAC, Closers",
    importa: "Facilidade de uso, mobilidade, produtividade do dia a dia",
  },
  {
    papel: "Comprador Técnico",
    onvox: "Gerente de TI ou Coordenador de Infraestrutura",
    takeflow: "Gerente de Operações ou Desenvolvedor",
    importa: "Estabilidade, integração com CRM, API aberta, conformidade com LGPD",
  },
  {
    papel: "Promotor / Coach",
    onvox: "Supervisor Comercial que quer métricas e dashboards",
    takeflow: "SDR líder ou Head de Marketing ambicioso",
    importa: "Quer ferramenta que o faça brilhar internamente e bater meta",
  },
];

export const BATTLECARDS = [
  {
    concorrente: "GoTo",
    fraqueza: "Ticket médio superior. Recursos globais subutilizados para PME brasileira. Complexidade desnecessária para o porte do cliente.",
    narrativa: "\"O GoTo é premium global. A Omni entrega tudo o que você realmente precisa, com suporte em português, sem pagar por funcionalidade que você não vai usar.\"",
  },
  {
    concorrente: "Net2phone",
    fraqueza: "Custo de locação de equipamentos físicos. Menor simplicidade de uso. Ancora o cliente no hardware com contrato.",
    narrativa: "\"Com a net2phone você paga aluguel de equipamento todo mês. Com a Omni, você usa qualquer aparelho IP ou softphone — sem lock-in de hardware.\"",
  },
  {
    concorrente: "3CX",
    fraqueza: "Planos anuais em dólar (exposto ao câmbio). Dependência de rotas externas para funcionar. Complexidade técnica de implementação.",
    narrativa: "\"O 3CX é bom para TI, mas é difícil de gerenciar e o custo oscila com o câmbio. A Omni tem contrato em real, implementação direta e suporte 24/7 sem depender de parceiro.\"",
  },
  {
    concorrente: "Voz Negócio",
    fraqueza: "Preço base atraente, mas cobra extra por URA, gravação e funcionalidades básicas. Histórico de reclamações de qualidade.",
    narrativa: "\"Na Voz Negócio, URA e gravação são taxas à parte. Na Omni, estão incluídas — o preço que você vê é o que você paga. Sem surpresa na fatura.\"",
  },
  {
    concorrente: "Baldussi Telecom",
    fraqueza: "Foco em segurança/LGPD via Google Cloud. Perfil mais técnico, menos consultivo e relacional.",
    narrativa: "\"A Baldussi tem tecnologia, mas a Omni entrega parceria. A gente não instala e some — ficamos ao lado do cliente por anos, evoluindo o ecossistema conforme o negócio cresce.\"",
  },
  {
    concorrente: "Operadoras tradicionais (Vivo, Claro, Tim)",
    fraqueza: "Cobranças ocultas, suporte genérico e lento, sem dados de gestão, sem visibilidade gerencial, hardware obsoleto.",
    narrativa: "\"Com operadora tradicional, você não sabe quanto cada ramal custa, quem ligou, por quanto tempo. A Omni dá dashboard, relatório e gravação — você gerencia pelo celular.\"",
  },
];

export const NARRATIVE_STEPS = [
  {
    passo: "1",
    nome: "Contexto — o mercado mudou, a comunicação das empresas não",
    script: "\"70% das empresas do nosso mercado ainda usam PABX físico. O problema não é só custo — é governança, escala e visibilidade que elas não têm.\"",
  },
  {
    passo: "2",
    nome: "Problema — perdas ocultas que o gestor não enxerga",
    script: "\"Cada chamada perdida é uma venda perdida. Cada conversa sem registro é um risco jurídico. Cada ramal físico em filial é um custo de manutenção que cresce com a inflação.\"",
  },
  {
    passo: "3",
    nome: "Diagnóstico — o Raio-X operacional da Omni",
    script: "\"Antes de propor qualquer solução, a gente faz o Raio-X: mapeamos sua estrutura atual, quantificamos o custo real e identificamos onde está o gargalo.\"",
  },
  {
    passo: "4",
    nome: "Solução — ecossistema sob medida, não produto genérico",
    script: "\"Com base no diagnóstico, a gente monta um ecossistema que pode incluir voz, WhatsApp com IA, integração com CRM e auditoria cognitiva — dependendo do que sua operação precisa.\"",
  },
  {
    passo: "5",
    nome: "Resultado — ROI concreto com prova social",
    script: "\"A Neobetel reduziu 80% da conta 0800. A Comvem cortou 40% em telefonia móvel. O British Council está conosco há mais de 5 anos. Posso te mostrar como calcular o ROI para o seu caso?\"",
  },
];

export const RAIO_X = [
  {
    dimensao: "Infraestrutura",
    pergunta: "\"Você usa PABX físico ou já tem algum sistema em nuvem?\"",
    resolve: "Migração para OnVox sem perda de número ou histórico, sem downtime",
  },
  {
    dimensao: "Visibilidade",
    pergunta: "\"Você consegue ver hoje quantas ligações seu time perdeu essa semana?\"",
    resolve: "Dashboard em tempo real + relatórios automáticos de produtividade",
  },
  {
    dimensao: "Custo",
    pergunta: "\"Você sabe exatamente quanto cada ramal custa por mês, incluindo manutenção de hardware?\"",
    resolve: "Redução de custo com previsibilidade (contrato em real, sem variação cambial)",
  },
  {
    dimensao: "WhatsApp",
    pergunta: "\"Quantos números de WhatsApp seu time usa para atender clientes? Você tem visibilidade do que é dito?\"",
    resolve: "TakeFlow: multi-número unificado, IA de triagem, integração CRM",
  },
  {
    dimensao: "Auditoria",
    pergunta: "\"Quando um cliente reclama de um atendimento, você consegue ouvir a gravação da chamada?\"",
    resolve: "Gravação de 100% das chamadas + auditoria cognitiva com IA",
  },
  {
    dimensao: "Mobilidade",
    pergunta: "\"Seus funcionários que trabalham em campo conseguem receber ramal pelo celular?\"",
    resolve: "Mobilidade corporativa — ramal no app, sem chip extra, sem hardware",
  },
];

export type Objection = {
  tag: string;
  question: string;
  answer: string;
};

export const OBJECTIONS_M1: Objection[] = [
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

export const CHECKLIST_M1 = [
  "O time conhece e consegue reproduzir o pitch de elevador em até 30 segundos sem ler",
  "Cada vendedor sabe identificar o cluster de ICP e o decisor econômico antes da primeira reunião",
  "As frases proibidas de posicionamento foram comunicadas e eliminadas em roleplay",
  "O Raio-X operacional tem roteiro-padrão de 6 perguntas utilizado em toda reunião de diagnóstico",
  "O time sabe responder as 7 objeções mapeadas — testado em roleplay interno com feedback gravado",
  "A narrativa de diferenciação por concorrente está documentada e acessível no CRM ou Notion",
  "As provas sociais (Neobetel, Comvem, British Council) estão formatadas em one-pagers para uso em reunião",
  "O gestor validou o posicionamento com pelo menos 3 clientes atuais e coletou depoimento ou NPS",
  "O time passou por 1 simulação completa de reunião de diagnóstico com feedback do gestor",
  "A mensagem central de vendas foi revisada com marketing para consistência em todos os canais",
];

export const ORIGENS = [
  {
    pratica: "Posicionamento central e proposta de valor",
    origem: "Omni / PAR",
    referencia: "Apresentação Omni Assessoria + PAR OnVox & TakeFlow (Vinteo 2026)",
  },
  {
    pratica: "ICPs por cluster (5 perfis)",
    origem: "Omni / PAR",
    referencia: "Mapeamento de melhores clientes por LTV — PAR p. 10-17",
  },
  {
    pratica: "Narrativa do Raio-X operacional",
    origem: "Omni",
    referencia: "Apresentação Omni Assessoria — proposta de valor central",
  },
  {
    pratica: "Provas sociais (Neobetel, Comvem, British Council)",
    origem: "Omni",
    referencia: "Histórico de clientes conforme apresentação Omni",
  },
  {
    pratica: "Clusters de atuação e mapeamento de personas",
    origem: "Omni / PAR",
    referencia: "PAR p. 10-17 — Explorando o ICP",
  },
  {
    pratica: "Mapa de decisores (4 papéis)",
    origem: "Externo adaptado",
    referencia: "Miller Heiman Strategic Selling — adaptado ao contexto Omni/PAR",
  },
  {
    pratica: "Narrativa em 5 passos",
    origem: "Externo adaptado",
    referencia: "StoryBrand (Donald Miller) — adaptado à realidade operacional da Omni",
  },
  {
    pratica: "Estrutura de objeções (reconheça → reframe → prova)",
    origem: "Externo adaptado",
    referencia: "Challenger Sale + Sandler — scripts reescritos com linguagem e cases da Omni",
  },
  {
    pratica: "Diferenciação por concorrente (Battle Cards)",
    origem: "Externo + PAR",
    referencia: "Battle Cards — metodologia HubSpot/Salesforce; conteúdo do PAR p. 19-21",
  },
  {
    pratica: "Frases proibidas de posicionamento",
    origem: "Externo adaptado",
    referencia: "HubSpot Sales Positioning + análise dos materiais Omni",
  },
];

export const FUTURE_MODULES_CONTENT = [
  "Cadeia completa de qualificação de leads (framework BANT/MEDDIC adaptado) — Módulo 2 (SDR/BDR)",
  "Scripts detalhados de cold call, cold email e LinkedIn/WhatsApp — Módulo 2",
  "Critérios de passagem de bastão SDR → Closer (SLA de handoff) — Módulo 2 e 3",
  "Estrutura completa da reunião de diagnóstico como sessão formal com roteiro, deck e template de notas — Módulo 3 (Closers)",
  "Business case e cálculo de ROI formalizado (planilha ou template) — Módulo 3",
  "Estrutura de proposta comercial (o que incluir, como apresentar, pricing) — Módulo 3",
  "Técnicas de negociação e fechamento específicas — Módulo 3",
  "Processo de onboarding do cliente pós-assinatura — Módulo 4 (CS/Implantação)",
  "Playbook de expansão de conta (upsell e cross-sell) — Módulo 4",
  "Metas, comissionamento e rituais comerciais — Módulo 5",
  "Métricas e KPIs por função (SDR, Closer, CS) — Módulos 2, 3 e 4",
];

export const IMMEDIATE_ACTIONS = [
  "Formalização de one-pagers de prova social: Neobetel, Comvem e British Council precisam de documento visual pronto para uso em campo (não existe ainda — criar antes do treinamento do time)",
  "Definição do SLA de suporte com número exato de horas/resposta — mencionado nas objeções de preço e contrato como argumento, mas a política interna não foi documentada",
  "Clareza sobre flexibilidade contratual: a objeção de contrato menciona possibilidade de negociação de prazo, mas os limites internos não foram definidos — gestor precisa estabelecer regras antes de o time usar esse argumento",
  "Posicionamento de preço da TakeFlow vs. concorrentes diretos de WhatsApp corporativo (Treble, Weni, Blip, Zenvia) — o PAR mapeou concorrentes da OnVox, mas não mapeou players diretos da TakeFlow; battle cards da TakeFlow estão ausentes",
  "Template padronizado do Raio-X: existe como conceito e roteiro de perguntas, mas não como documento formal entregue ao cliente — criar versão em PDF ou slides antes do treinamento",
  "Validação formal das provas sociais: os dados percentuais (20% Neobetel, 40% Comvem, 80% 0800) devem ser formalizados em autorização escrita dos clientes para uso comercial e marketing",
  "Processo de demonstração técnica: o PAR menciona que o ciclo de venda da OnVox inclui demonstração do PABX em nuvem — um roteiro-padrão de demo não foi desenvolvido neste módulo",
  "Definição de ticket mínimo e porte mínimo de prospect: o PAR indica faturamento acima de R$5MM e 30-50 funcionários como ICP ideal para OnVox, mas não há definição equivalente para TakeFlow — não foi formalizado como critério de qualificação",
];

export const MODULES = [
  { id: 1, title: "Fundação Estratégica", href: "/playbook/modulo-1", available: true },
  { id: 2, title: "Pré-vendas (SDR/BDR)", href: "/playbook/modulo-2", available: true },
  { id: 3, title: "Closers", href: null, available: false },
  { id: 4, title: "CS / Implantação", href: null, available: false },
  { id: 5, title: "Metas e Comissionamento", href: null, available: false },
];

export const MODULE_1_SECTIONS = [
  { id: "sec-1", label: "Seção 1 — Posicionamento e Mensagem" },
  { id: "sec-2", label: "Seção 2 — Proposta de Valor por ICP" },
  { id: "sec-3", label: "Seção 3 — Diferenciação" },
  { id: "sec-4", label: "Seção 4 — Narrativa de Vendas" },
  { id: "sec-5", label: "Seção 5 — Objeções" },
  { id: "sec-6", label: "Seção 6 — Checklist de Implementação" },
  { id: "sec-7", label: "Seção 7 — Origem das Práticas" },
  { id: "sec-8", label: "Seção 8 — Pontos de Atenção" },
];
