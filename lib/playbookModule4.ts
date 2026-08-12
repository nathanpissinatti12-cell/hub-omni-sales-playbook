// Conteúdo do Playbook de Vendas Omni Assessoria — Módulo 4 (Produto,
// Mercado & Precificação), transcrito de
// "Modulo4_Produto_Mercado_Precificacao_Omni.pdf" (2026). Conteúdo mantido
// fiel ao documento original — não editorializar números, preços ou
// políticas sem nova fonte.

// ---------- 4.1.1 Onvox ----------

export const ONVOX_STATS = [
  ["Países de presença", "Mais de 120"],
  ["Usuários ativos", "Mais de 450.000"],
  ["Canais globais", "Mais de 9.000"],
  ["PABX instalados", "Mais de 250.000"],
  ["Colaboradores", "Mais de 260"],
  ["Profissionais certificados", "Mais de 11.000"],
];

export const ONVOX_DIFFERENTIALS = [
  ["Pouca flexibilidade para expansão", "Fácil adição de ramais e linhas"],
  ["Recursos limitados (espera, transferência)", "Recursos avançados: gravação, conferência"],
  ["Dificuldade de monitoramento", "Gestão centralizada e relatórios detalhados"],
  ["Atendimento básico sem fila", "Roteamento avançado e URA"],
  ["Difícil integração com CRM/ERP", "Integração facilitada com sistemas empresariais"],
  ["Chamadas custosas", "Chamadas internas e externas gratuitas"],
];

export const ONVOX_PABX_FEATURES = [
  "Ramais via softphone (iOS, Android, PC, notebook, extensão Chrome)",
  "URA configurável com horários e regras (editor visual drag-and-drop)",
  "Chamadas ilimitadas para fixos e móveis no Brasil",
  "Chamadas para fixos em mais de 50 países sem custo adicional",
  "Música de espera personalizada",
  "Correio de voz enviado para o e-mail",
  "Conferência de grupo",
  "Fax virtual",
  "Mensagens instantâneas entre colaboradores",
  "Portabilidade numérica (DID)",
  "Login simultâneo em múltiplos dispositivos — ramal ativo em todos os aparelhos ao mesmo tempo (novidade 2026)",
  "Controle remoto de dispositivos (CTI) — controlar o telefone de mesa pelo app",
];

export const ONVOX_APP_PLATFORMS = [
  "Mobile (iOS e Android)",
  "Desktop (Windows e macOS)",
  "Web (acesso pelo navegador, sem instalação)",
  "Extensão Chrome (integração direta ao navegador)",
];

export const ONVOX_CONTACT_CENTER_INBOUND = [
  "Filas de atendimento com distribuição inteligente",
  "Monitoramento em tempo real com opção de intervenção (escuta, sussurro, intrusão)",
  "Métricas detalhadas e relatórios de desempenho",
  "Gravação e histórico de chamadas por contato",
  "Logs completos de chamadas de fila — gestores e agentes visualizam quem atendeu cada chamada (novidade 2026)",
];

export const ONVOX_CONTACT_CENTER_OUTBOUND = [
  "Discagem automática progressiva e preditiva",
  "Gestão de campanhas",
];

export const ONVOX_OMNICHANNEL = [
  "Integração de: telefone, e-mail, chat, WhatsApp, Facebook/Meta em uma única plataforma",
  "Histórico centralizado por cliente (cliente não repete informações ao trocar de canal)",
  "Transferência de sessões entre agentes",
  "Reassignamento de sessões em massa (novidade 2026)",
  "Criação de novas sessões mesmo quando já existe sessão ativa entre as partes (novidade 2026)",
];

export const ONVOX_AI = [
  {
    title: "1. Recepcionista Virtual com IA (lançado em abril/2026)",
    items: [
      "Atende chamadas 24 horas por dia, 7 dias por semana, sem operador humano",
      "Usa Processamento de Linguagem Natural (PLN) para entender o que o cliente quer",
      "Responde perguntas com base em base de conhecimento configurada (documentos e/ou site)",
      "Transfere chamada para o ramal ou departamento correto sem menu de URA",
      "Gera relatórios, transcrições e resumos de cada atendimento",
      "Configuração sem código — qualquer pessoa configura em minutos",
      "Disponível nos planos Enterprise e Ultimate",
    ],
  },
  {
    title: "2. Transcrição de Chamadas com IA",
    items: [
      "Enterprise: 120 minutos gratuitos/mês",
      "Ultimate: 240 minutos gratuitos/mês",
      "Pacote adicional: 1.000 minutos por R$ 300,00",
    ],
  },
  {
    title: "3. Relatórios de Chamadas Personalizados com IA (lançado em abril/2026)",
    items: [
      "Construtor de relatórios sob medida (sem templates fixos)",
      "Seleção de dataset, dimensões, filtros e métricas personalizadas",
      "Exportação em CSV, XLS, HTML ou PDF",
      "Agendamento automático de relatórios recorrentes",
    ],
  },
];

export const ONVOX_INTEGRATIONS = [
  ["CRM", "Salesforce, Zoho CRM, HubSpot, pipelines customizados via OAuth2 PKCE"],
  ["Microsoft", "Teams, Microsoft 365, Azure Active Directory, Outlook"],
  ["Mensageria social", "WhatsApp, Facebook, SMS"],
  ["Hotelaria", "Oracle Opera PMS"],
  ["Identidade corporativa", "Microsoft Active Directory / Azure AD"],
  ["Infraestrutura", "Tronco SIP, gateways VoIP, intercom/porteiros"],
  ["Hardware", "Provisionamento automático de +500 modelos (Yealink, FlyingVoice, Fanvil, snom, Atcom)"],
  ["API aberta", "Integração com qualquer sistema via API REST"],
];

export const ONVOX_SECURITY = [
  "Certificações: GDPR, ISO 27001, ISO 9001, ISO 14001",
  "Conexão segura com tunelamento criptografado para filiais remotas (sem VPN complexa)",
  "Proteção contra fraude de chamadas (toll fraud)",
  "Autenticação via Microsoft Azure AD / Active Directory",
  "Suporte a SSO (Single Sign-On)",
];

export const ONVOX_ROADMAP = [
  ["Set/2025", "Transcrição e Resumo de Chamadas com IA", "IA em voz"],
  ["Out/2025", "API de Mensagens Omnichannel + API em massa", "Integração avançada"],
  ["Nov/2025", "Solução STIR/SHAKEN, SSO com Red Hat", "Segurança e identidade"],
  ["Dez/2025", "Estacionamento de chamada com 1 toque, Follow-up por e-mail", "Produtividade"],
  ["Jan/2026", "CDR Avançado, Modo escuro", "UX e visibilidade"],
  ["Mar/2026", "Call Flow Designer aprimorado", "Configuração visual de roteamento"],
  ["Abr/2026 (GA)", "Recepcionista Virtual com IA, Relatórios Personalizados, Proxy para filiais, Login simultâneo", "🔥 Grande lançamento"],
  ["Abr/2026 (Beta)", "Logs de fila completos, Sincronização de avatares com AD, Desvio automático em ocupado, Reassignamento Omnichannel", "Em homologação"],
];

export const ONVOX_VERTICALS = [
  "Hotelaria — integração com PMS (sistema de gestão hoteleira)",
  "Saúde — comunicação segura e conforme regulamentações",
  "Educação — comunicação unificada para campus",
  "Varejo — atendimento multicanal",
  "Financeiro — segurança e conformidade",
  "PMEs e Empresas — desde pequenas até operações enterprise",
];

export const ONVOX_IMPLEMENTATION = [
  "Assinatura digital — via plataforma confiável",
  "Boas-vindas do Onboarding — preenchimento de planilha de configuração",
  "Configuração — feita pelo suporte com número provisório (sem interromper operação)",
  "Treinamento — usuários e administradores",
  "Go-live e portabilidade numérica — ativação do número oficial na Onvox",
  "Acompanhamento periódico — suporte pós-implantação",
];

export const ONVOX_BENEFITS_BY_AREA = [
  ["Diretoria", "Visão completa da operação, modernização da comunicação"],
  ["Financeiro", "Custo previsível, redução de gastos com manutenção e hardware"],
  ["Comercial", "Menos chamadas perdidas, distribuição inteligente, mais oportunidades aproveitadas"],
  ["Usuários", "Interface simples, trabalho remoto, gravação para segurança"],
  ["TI", "Menos infraestrutura local, integrações, atualizações automáticas, configuração centralizada"],
  ["Gestão", "KPIs claros, monitoramento em tempo real, base para treinamento"],
];

export const ONVOX_DOCS = ["RG e CPF do representante legal (digitalizado)", "Contrato Social (digitalizado)"];

// ---------- 4.1.2 TakeFlow ----------

export const TAKEFLOW_ICPS = [
  "Clínicas e Consultórios — agendamentos e lembretes",
  "Escritórios de Advocacia — gestão de casos e clientes",
  "Contabilidades — documentos e declarações",
  "Imobiliárias — atendimento 24h",
  "Startups e Fintechs — suporte escalável",
  "Agências de Marketing — gestão de campanhas",
  "Escolas e Cursos — comunicados e matrículas",
  "Corretoras de Seguros — cotações e apólices",
  "E-commerces — status de pedidos",
  "Hotéis e Pousadas — reservas e check-in",
  "Empresas de Tecnologia — suporte técnico",
  "Consultórios Odontológicos — lembretes de consulta",
];

export const TAKEFLOW_FLOW_BUILDER = [
  "Editor drag-and-drop com 30+ tipos de nós — sem código",
  "Tipos de nós: Conteúdo, Horário, IA, Condição, Etiqueta, HTTP, Banco de dados, Assistente, e outros",
  "Permite criar: funil de vendas, qualificação de lead, agendamento, cobrança, suporte etc.",
];

export const TAKEFLOW_CHATBOT_AI = [
  "Integração nativa com OpenAI (GPT)",
  "IA agêntica: não apenas responde, mas resolve tarefas — consulta sistemas, agenda, gera orçamento, processa pedidos",
  "Transferência para humano com contexto completo quando necessário",
  "Treinamento com base em casos reais (mínimo recomendado: 50–100 exemplos)",
  "Implementação em 2 a 4 semanas para agente completo",
];

export const TAKEFLOW_QUEUES = [
  "Organização por setores (Vendas, Suporte, Financeiro etc.)",
  "Regras de horário por departamento",
  "Transferência inteligente com contexto da conversa",
  "Multi-sessões por atendente",
];

export const TAKEFLOW_CAMPAIGNS = [
  "Disparo em massa com fluxo vinculado — não é disparo genérico",
  "Acompanhamento em tempo real: quantidade enviada, entregue, taxa de entrega",
  "Proteção automática de número: limite de ~40 novos contatos por janela rolling de 24h",
  "Tratamento automático de erros: código 408 (timeout), 403 (número inválido), 503 (instabilidade WhatsApp)",
];

export const TAKEFLOW_DASHBOARD = [
  "Métricas em tempo real: atendimentos ativos, tempo médio, distribuição por setor",
  "Ranking de atendentes — performance individual",
  "Relatórios estratégicos para tomada de decisão",
  "Controle total de permissões por usuário",
];

export const TAKEFLOW_INTEGRATIONS = [
  "Webhooks",
  "N8N (automação de workflows entre sistemas)",
  "OpenAI GPT",
  "HTTP (chamadas de API externas dentro dos fluxos)",
  "Banco de dados (consulta e escrita via nó de fluxo)",
  "WhatsApp Business API Oficial (Meta)",
  "Conexão via QR Code (para uso pessoal/não oficial) ou API Oficial",
];

export const TAKEFLOW_SERVICE_FEATURES = [
  "Listas interativas",
  "Botões de resposta rápida",
  "Respostas rápidas (templates internos)",
  "Etiquetas de classificação de conversa",
  "Agendamento de mensagens",
  "Multi-sessões simultâneas",
];

export const TAKEFLOW_AI_COMPARISON = [
  ["Trocas de voo", "\"Digite 1 para alterações\"", "Verifica disponibilidade e agenda"],
  ["Pedido não chegou", "Link para rastreamento", "Consulta CEP, verifica transportadora, oferece solução"],
  ["Cancelamento", "Link de cancelamento", "Entende motivo, oferece retenção, processa se insistir"],
  ["Produto disponível?", "\"Não entendi. Repita?\"", "Consulta estoque, mostra foto, adiciona ao carrinho"],
];

export const TAKEFLOW_AGENT_ARCHITECTURE = "Percepção → Raciocínio → Ação → Memória";
export const TAKEFLOW_AGENT_INTEGRATIONS = "ERP, agenda/calendário, CRM, catálogo de produtos, gateway de pagamento.";
export const TAKEFLOW_AGENT_HUMAN_NEEDED = "Crises emocionais, decisões de alto valor financeiro (ex: reembolso acima de R$ 5.000), negociações de contrato, situações sem precedente.";

export const TAKEFLOW_PROMISES = [
  "+40% de conversão para Vendas",
  "-60% no tempo de espera para Suporte",
  "100% de visibilidade para Gestores",
  "85% das tarefas resolvíveis de forma autônoma por IA agêntica",
  "10x mais eficiente que automação baseada em regras",
  "Redução de até 40% na inadimplência com lembretes automáticos de pagamento",
  "Redução de até 80% no gasto com mensagens da Meta ao usar corretamente categorias de utilidade vs. marketing",
];

// ---------- 4.1.3 evolu.AI ----------

export const EVOLUAI_SYMPTOMS = [
  "Impossível ouvir 100% das ligações manualmente",
  "Feedback inconsistente e subjetivo entre gestores",
  "Problemas recorrentes identificados tarde demais",
  "Dificuldade em escalar boas práticas para o time",
  "Vendedores repetem erros sem saber",
  "Gestores tomam decisões com dados incompletos",
  "Impossibilidade de replicar os top performers",
];

export const EVOLUAI_FLOW = [
  "Ligação encerrada",
  "IA transcreve automaticamente",
  "IA avalia com base na metodologia configurada",
  "Score gerado por pilar + pontuação geral",
  "Relatório (Raio-X) disponível em segundos",
  "Gestor recebe diagnóstico completo + alertas automáticos",
];

export const EVOLUAI_5D = [
  ["Rapport", "Qualidade da conexão inicial com o cliente"],
  ["Escuta Ativa", "Se o vendedor ouviu e reagiu ao que o cliente disse"],
  ["Clareza", "Se a proposta de valor foi explicada de forma objetiva"],
  ["Contorno de Objeções", "Se as resistências do cliente foram tratadas com técnica"],
  ["Fechamento", "Se o vendedor conduziu o cliente em direção a uma decisão"],
];

export const EVOLUAI_SUCCESS_CRITERIA = [
  "SPIN Selling — verificação de perguntas de Situação, Problema, Implicação e Necessidade de Solução em momentos estratégicos",
  "BANT — confirmação de coleta de Orçamento (Budget), Autoridade, Necessidade e Timing",
  "Rapport e Alinhamento — qualidade da conexão inicial e alinhamento de expectativas",
  "Proposta de Valor Clara — se benefícios e diferenciais foram articulados adequadamente",
  "Tentativa de Fechamento — se e como o vendedor conduziu o cliente à decisão",
];

export const EVOLUAI_RED_FLAGS = [
  "Monólogos Excessivos — vendedor fala por muito tempo sem engajar o cliente",
  "Falta de Clareza Técnica — explicações confusas, jargões excessivos, proposta de valor vaga",
  "Excesso de Informalidade — linguagem inadequada para o contexto comercial",
  "Objeção de Preço Não Tratada — cliente levanta resistência de custo e vendedor não aplica reframe ou ancoragem de valor",
  "Ausência de Próximo Passo — call termina sem compromisso claro de follow-up ou avanço no funil",
];

export const EVOLUAI_RAIOX_ITEMS = [
  "Resumo Executivo (TL;DR) — síntese objetiva para decisão rápida do gestor",
  "Perfil e Sentimento do Cliente — tom detectado (neutro, positivo, resistente), nível de engajamento (passivo, participativo, entusiasta) e perfil comportamental",
  "Motivo Central e Dores — problema principal, impacto declarado e urgência percebida",
  "Dados Rígidos Coletados — número de filiais, provedor atual, orçamento mencionado, CNPJ e outros dados extraídos automaticamente da conversa",
  "Qualificação BANT — preenchida automaticamente (Budget, Authority, Need, Timing)",
  "Perfil DISC do cliente — padrão comportamental identificado pela IA",
  "Estágio da Venda — onde está no funil (Conexão → Qualificação → Apresentação → Fechamento)",
  "Avaliação do Atendente — postura consultiva, eficácia da solução apresentada, aderência à metodologia",
  "Status e Próximos Passos — situação atual + ações recomendadas para avanço no funil",
  "Produtos explorados na conversa — identificados automaticamente (ex: PABX em nuvem, IA de Transcrição, Locação de Hardware, Omnichannel)",
];

export const EVOLUAI_SENTIMENT = [
  "Momentos de alta receptividade do cliente (janelas de fechamento)",
  "Pontos de tensão ou resistência que o vendedor deveria ter tratado",
  "Variação de engajamento do cliente ao longo da call",
  "Nível de formalidade do vendedor em diferentes momentos",
];

export const EVOLUAI_MANAGER_DASHBOARD = [
  "Média por Função — compara BDRs vs. Closers vs. Suporte; filtra por período, supervisor ou campanha",
  "Feed de Análises Recentes — todas as análises processadas com data, vendedor, supervisor, score e status",
  "Gerenciamento de Usuários — médias individuais, número de análises, curva de aprendizado, atribuição de supervisores",
  "Análise 5D por Pilar — gráfico radar individual por vendedor",
];

export const EVOLUAI_INTEGRATIONS = [
  ["Automação de workflows", "n8n, Zapier"],
  ["CRMs nativos", "Salesforce, HubSpot, RD Station"],
  ["Alertas", "WhatsApp e E-mail (por regras de score)"],
  ["Upload de arquivos", "Áudio e vídeo em qualquer formato"],
  ["Integração de chamadas", "Via integração nativa com plataforma de telefonia"],
];

export const EVOLUAI_DIFFERENTIALS = [
  ["IA com Metodologia", "Não apenas transcreve — avalia com SPIN Selling e BANT"],
  ["Feedback Imediato", "Score disponível segundos após a conversa"],
  ["100% Customizável", "A plataforma se adapta à metodologia do cliente, não o contrário"],
  ["Auditoria Total", "100% das conversas analisadas — elimina viés humano"],
  ["24/7 Ativo", "Supervisor ininterrupto sem custo adicional de RH"],
];

export const EVOLUAI_PROCESS = [
  "Demo personalizada: a equipe analisa uma amostra real das conversas do cliente e apresenta o diagnóstico completo — o cliente vê o valor antes de assinar",
  "Onboarding em 48 horas: da assinatura à primeira análise em menos de 2 dias",
  "ROI mensurável desde o primeiro mês: identificação imediata de gaps + aumento de conversão já nas primeiras semanas",
];

export const EVOLUAI_IMPACT_PHRASE =
  '"Transforme cada conversa da sua equipe em dados de performance, insights de coaching e vantagem competitiva real — com a IA que trabalha enquanto você dorme."';

// ---------- 4.2 API Oficial Meta ----------

export const META_CONVERSATION_TYPES = [
  ["Serviço", "O cliente", "Cliente manda mensagem → empresa responde livremente por 24h", "GRATUITO"],
  ["Iniciada pela empresa", "A empresa", "Empresa precisa usar template aprovado pela Meta", "COBRADO"],
];

export const META_MESSAGE_CATEGORIES = [
  ["Marketing", "Promoções, campanhas, reativação de leads, ofertas", "\"Temos uma condição especial para você hoje!\"", "~R$ 0,31–0,40/conversa"],
  ["Utilidade", "Notificações transacionais ligadas a uma ação do cliente", "Confirmação de pedido, lembrete de consulta, status de entrega", "~R$ 0,04–0,08/conversa"],
  ["Autenticação", "Códigos de verificação, OTP, login seguro", "\"Seu código é 4821\"", "~R$ 0,07/conversa"],
  ["Serviço", "Resposta a mensagem iniciada pelo cliente (janela 24h)", "Qualquer resposta dentro da janela", "GRATUITO"],
];

export const META_COST_STRUCTURE = [
  ["Plano TakeFlow", "Assinatura mensal da plataforma (fluxos, chatbot IA, dashboard, suporte)", "Omni / TakeFlow"],
  ["Mensagens Meta", "Por conversa entregue, conforme categoria", "Diretamente à Meta via Business Manager do cliente"],
];

export const META_TEMPLATE_EXAMPLES = [
  { categoria: "Utilidade", texto: "\"Olá, {{nome}}. Seu pedido {{número}} foi enviado. O rastreio é {{código}}.\"" },
  { categoria: "Marketing", texto: "\"Olá, {{nome}}. Temos uma condição especial para você finalizar sua compra hoje. Acesse: {{link}}\"" },
  { categoria: "Autenticação", texto: "\"Seu código de acesso é {{código}}. Válido por 10 minutos. Não compartilhe.\"" },
];

export const META_TIERS = [
  ["Inicial (sem verificação)", "250 conversas/dia", "Conta recém-criada"],
  ["Nível 1", "1.000 conversas/dia", "Verificação no Meta Business Manager"],
  ["Nível 2", "10.000 conversas/dia", "Manter qualidade + volume consistente"],
  ["Nível 3", "100.000 conversas/dia", "Progressão automática por desempenho"],
  ["Nível 4", "Ilimitado", "Aprovação específica da Meta"],
];

export const META_QUALITY = [
  ["🟢 Verde", "Alta qualidade", "Tudo certo. Conta saudável, pode crescer."],
  ["🟡 Amarelo", "Média qualidade", "Sinal de alerta. Pode piorar se continuar."],
  ["🔴 Vermelho", "Baixa qualidade", "Perigo. Limite pode ser reduzido ou conta suspensa."],
];

export const META_QUALITY_DOWN = [
  "Muitos destinatários marcando 'Denunciar spam'",
  "Mensagens não lidas / sem resposta em escala",
  "Envio para bases sem opt-in (consentimento)",
  "Volume repentino muito alto sem histórico",
];

export const META_QUALITY_UP = [
  "Mensagens relevantes e personalizadas",
  "Base de contatos com opt-in explícito",
  "Taxa de resposta alta",
  "Respeitar frequência de envio",
];

export const META_OPTIN_METHODS = [
  "Formulário de cadastro com campo: 'Aceito receber mensagens no WhatsApp'",
  "Botão de contato no site (o cliente inicia a conversa — melhor forma)",
  "QR code em material físico",
  "Link wa.me/número em e-mail marketing",
];

export const META_WARMUP_STEPS = [
  "Comece com 100–250 mensagens/dia nos primeiros dias",
  "Aumente gradualmente (20–30% ao dia)",
  "Monitore a qualidade constantemente",
  "Priorize contatos que têm chance alta de responder",
  "Nunca dispare lista fria sem histórico de relacionamento",
];

export const META_NUMBER_RULES = [
  "O número NÃO pode estar ativo em nenhum app WhatsApp ou WhatsApp Business no momento da ativação",
  "Se o número já foi usado no app, precisa apagar a conta antes (perde histórico de conversas)",
  "O número precisa ser exclusivo para uso da API — não pode usar no celular pessoal simultaneamente",
  "Pode ser número fixo ou móvel com código de país brasileiro",
];

export const META_REQUIREMENTS = [
  "CNPJ ativo (em 2026, MEIs também podem, mas com algumas restrições em pré-aprovação)",
  "Meta Business Manager criado e VERIFICADO (com razão social, CNPJ e endereço)",
  "Número de telefone exclusivo, não ativo em app WhatsApp",
  "Display Name aprovado pela Meta (nome que aparece para o cliente — leva 3 a 7 dias úteis)",
  "Configurar método de pagamento na Business Manager (cartão de crédito internacional ou boleto)",
  "Aceitar os Termos de Serviço da WhatsApp Business Platform",
];

export const META_QA = [
  { q: "\"Vou perder meu histórico de conversas?\"", a: "Sim, se o número já estava em uso no app WhatsApp e precisar ser migrado. Por isso recomendamos usar um número novo ou exclusivo dedicado à operação." },
  { q: "\"Posso usar meu número pessoal?\"", a: "Não. O número precisa ser exclusivo para a API. Se estiver em uso no celular, o app precisa ser desinstalado e a conta apagada antes." },
  { q: "\"Quanto vou pagar por mês para a Meta?\"", a: "Depende do volume e das categorias. As primeiras 1.000 conversas de serviço são gratuitas. Para campanhas de marketing, custa em torno de R$ 0,31 por conversa entregue. Usamos a calculadora da TakeFlow para simular com o cenário real do cliente." },
  { q: "\"Posso mandar mensagem para qualquer pessoa?\"", a: "Não. Apenas para contatos que deram opt-in (autorizaram receber mensagens). Para quem nunca interagiu, precisa de template aprovado — e mesmo assim, sem opt-in, há risco de denúncias." },
  { q: "\"Quantas mensagens posso mandar por dia?\"", a: "Começa em 250 por dia (conta verificada sobe para 1.000). Vai crescendo automaticamente conforme a qualidade da conta. Pode chegar a 100.000/dia ou ilimitado." },
  { q: "\"O que acontece se meu número for bloqueado?\"", a: "O número perde tudo — histórico, grupos, contatos. Não há recurso junto à Meta. Por isso a TakeFlow tem o sistema de proteção de ritmo (limite de ~40 novos contatos/24h na conexão via QR)." },
  { q: "\"Tem taxa de ativação da Meta?\"", a: "Não. A Meta não cobra taxa de setup. O custo é apenas por mensagens entregues e pelo plano da plataforma (TakeFlow)." },
  { q: "\"Posso ter mais de um número na mesma conta?\"", a: "Sim. Múltiplos números no mesmo Business Portfolio compartilham o mesmo nível de tier — vantagem: número novo já herda o tier do portfólio." },
  { q: "\"A API é necessária ou posso usar só QR Code?\"", a: "A conexão por QR Code (não oficial) é instável e tem risco de bloqueio a qualquer momento — a Meta pode encerrar sessões não oficiais. A API Oficial garante estabilidade, SLA da Meta (99,9% de uptime) e conformidade total." },
];

export const META_COMPARISON = [
  ["Múltiplos atendentes", "❌", "Até 5 dispositivos", "✅ Ilimitado"],
  ["Automação/Chatbot", "❌", "❌", "✅"],
  ["Campanhas em massa", "❌", "❌", "✅"],
  ["Integração com CRM", "❌", "❌", "✅"],
  ["Risco de bloqueio", "Alto (QR não oficial)", "Baixo", "Mínimo (oficial Meta)"],
  ["Estabilidade", "Baixa", "Média", "Alta (SLA Meta 99,9%)"],
  ["Relatórios e métricas", "❌", "Básico", "✅ Completo"],
  ["Custo de mensagem Meta", "R$ 0", "R$ 0", "Por conversa iniciada"],
];

export const META_COST_STRATEGIES = [
  "Incentivar o cliente a falar primeiro — toda conversa de serviço é gratuita por 24h",
  "Usar categoria Utilidade em vez de Marketing sempre que a mensagem for transacional — economia de até 9x por conversa",
  "Consolidar mensagens na janela ativa — se precisa mandar boleto e lembrete, manda os dois na mesma janela. Uma conversa, não duas.",
  "Segmentar bem a base — mandar para quem tem chance de responder mantém a qualidade e evita desperdício",
  "Não comprar listas frias — sem opt-in = denúncias = conta bloqueada",
  "Usar múltiplos números quando o volume for alto — a TakeFlow distribui a carga automaticamente",
];

// ---------- 4.3 Precificação Onvox ----------

export const ONVOX_CALC_CLIENT_FIELDS = [
  "Nome do cliente",
  "CNPJ",
  "Custo atual mensal (R$) — base para calcular economia",
  "Vendedor responsável",
  "Logo do cliente (PNG, JPG ou SVG, máx. 2MB) — aparece na proposta impressa",
];

export const ONVOX_PLANS = [
  ["Enterprise", "Solução completa para empresas"],
  ["Ultimate", "Recursos avançados e ilimitados"],
];

export const ONVOX_CALC_PLAN_CONFIG = [
  "Quantidade de ramais",
  "Preço por ramal (R$) — campo editável",
  "Preço por DID (R$) — campo editável",
  "Desconto de marketing (R$/mês) — campo editável com campo de motivo/descrição",
];

export const ONVOX_DID_CONFIG = [
  "Seleção de DDD por estado",
  "Quantidade configurável por DDD",
  "Campo para DIDs em portabilidade + Operadora Doadora",
];

export const ONVOX_DEVICE_BRANDS = ["Yealink", "FlyingVoice", "Headsets"];

export const ONVOX_CALC_SUMMARY = [
  "Mensalidade Onvox (ramais × preço + DIDs × preço + aparelhos em aluguel − desconto)",
  "Aparelhos à vista (valor separado)",
  "Taxa de Ativação — pode ser isenta (usar como concessão no fechamento)",
  "Economia mensal vs. custo atual",
  "Economia em 12 meses",
  "Economia em 36 meses",
];

export const ONVOX_ADDONS = [
  ["Transcrição", "Enterprise: 120 min grátis / Ultimate: 240 min grátis", "+ 1.000 min → R$ 300,00"],
  ["Minutos 0800", "Pacote avulso", "1.000 min → R$ 250,00"],
  ["Armazenamento", "Pacote adicional (máx. 500 GB, definido na contratação)", "50 GB → R$ 100,00"],
  ["Chamadas Internacionais", "Pacote adicional", "500 min → R$ 250,00"],
];

// ---------- 4.4 Precificação TakeFlow ----------

export const TAKEFLOW_BASE_PRICING = [
  ["Conexão", "Por número de telefone conectado à plataforma", "R$ 80,00/mês"],
  ["Licença", "Por usuário (atendente)", "R$ 39,90/mês"],
];

export const TAKEFLOW_AI_PACKAGES = [
  ["50/dia", "R$ 1.369,50", "R$ 1,00/atend.", "R$ 2.469,50", "R$ 1,70/atend."],
  ["100/dia", "R$ 2.490,00", "R$ 0,90/atend.", "R$ 4.490,00", "R$ 1,60/atend."],
  ["200/dia", "R$ 4.482,00", "R$ 0,80/atend.", "R$ 8.082,00", "R$ 1,45/atend."],
  ["300/dia", "R$ 6.349,50", "R$ 0,75/atend.", "R$ 11.449,50", "R$ 1,35/atend."],
];

export const TAKEFLOW_AI_RULES = [
  "Atendimentos são acumulativos dentro do mês — o limite é diário na média, mas o saldo acumula dentro do mesmo mês. Exemplo: pacote de 100/dia → se hoje usou 50, amanhã pode usar 150. O que vale é o total mensal (100/dia × 30 dias = 3.000 atendimentos/mês)",
  "Mínimo de 3.000 atendimentos no total do mês — independente do pacote escolhido, o piso de contratação é 3.000 atendimentos/mês",
  "Sem acúmulo entre meses — saldo não utilizado em um mês NÃO passa para o mês seguinte. Mês virou, contador zerou",
];

export const TAKEFLOW_IMPLEMENTATION_FEE = [
  ["Valor", "1,5x o valor da fatura mensal do cliente"],
  ["Quando é cobrado", "Junto com a 1ª fatura"],
  ["Aplica-se a", "Todos os projetos — com IA e sem IA"],
];

export const TAKEFLOW_CONTRACT_CONDITIONS = [
  ["POC / Isenção inicial", "30 dias grátis", "—"],
  ["1ª fatura", "Após 30 dias (mensalidade + implantação)", "Normal (mensalidade + implantação)"],
  ["Cancelamento no período de isenção", "Livre, sem multa", "—"],
  ["Fidelidade", "12 meses (após POC)", "SEM fidelidade"],
  ["Cancelamento após fidelidade", "Mediante análise", "Aviso prévio de 60 dias"],
];

export const TAKEFLOW_PITCH_COM_IA =
  '"Você não paga nada para testar. A gente configura tudo, treina a IA com o seu negócio, e você tem 30 dias para ver funcionando. Se não gostar, cancela sem pagar nada. Se gostar — e vai gostar — a primeira fatura só vem depois desse período."';
export const TAKEFLOW_PITCH_SEM_IA =
  '"Não tem fidelidade nenhuma. Se um dia quiser cancelar, só avisa com 60 dias de antecedência e pronto — sem multa, sem burocracia."';
export const TAKEFLOW_PITCH_IMPLANTACAO =
  '"A implantação é cobrada uma única vez, junto com a primeira fatura. É o valor que cobre toda a configuração da plataforma, os fluxos, a integração e o treinamento da equipe. Depois disso, só a mensalidade recorrente."';

export const TAKEFLOW_CONTRACT_FLOW = [
  "Assinatura do contrato",
  "30 dias de POC — operação real, custo zero",
  "Fim do POC → 1ª fatura gerada (mensalidade + implantação)",
  "Fidelidade de 12 meses ativa automaticamente",
  "Renovação",
];

export const TAKEFLOW_PROPOSAL_FORMULA =
  "Proposta TakeFlow = (Nº de conexões × R$ 80,00) + (Nº de licenças × R$ 39,90) + Pacote IA (se aplicável) + Mensagens Meta (pago pelo cliente direto à Meta — variável)";

export const TAKEFLOW_PROPOSAL_EXAMPLE = [
  "1 conexão: R$ 80,00",
  "3 licenças: R$ 119,70",
  "IA N1 100/dia: R$ 2.490,00",
  "Total plataforma: R$ 2.689,70/mês",
  "Implantação (1,5×): R$ 4.034,55 — cobrada na 1ª fatura após 30 dias de POC",
  "+ mensagens Meta (variável conforme uso)",
];

export const TAKEFLOW_WHEN_AI = [
  ["Recebe muitas perguntas repetitivas (horário, endereço, status, etc.)", "✅ IA resolve sozinha, libera atendente"],
  ["Tem pico de volume e equipe pequena", "✅ IA absorve o pico sem contratar"],
  ["Quer atendimento 24h sem plantão humano", "✅ IA é a resposta direta"],
  ["Operação simples, volume baixo, equipe suficiente", "⚠️ Avaliar — pacote base pode ser suficiente"],
];

// ---------- 4.5 Precificação evolu.AI ----------

export const EVOLUAI_PLANS = [
  ["Inicial", "R$ 750,00/mês", "Até 50h", "Score automático + Resumo Executivo + Dashboards + Suporte e-mail + Histórico de consumo"],
  ["Médio", "R$ 1.197,00/mês", "Até 85h", "Tudo do Inicial + Alertas WhatsApp/E-mail + API para CRM + Suporte prioritário com SLA"],
  ["Avançado", "R$ 1.797,00/mês", "120h+", "Tudo do Médio + Customização total de critérios/pesos + n8n e Zapier + Suporte dedicado + Onboarding personalizado"],
];

export const EVOLUAI_FOR_WHOM = [
  "Empresas com time comercial ativo que fazem ligações (SDR + Closer)",
  "Gestores que precisam de visibilidade sobre qualidade individual de cada atendimento",
  "Operações que querem replicar os top performers para o time todo",
  "Empresas que já usam a Onvox — as gravações alimentam diretamente a evolu.AI",
];

// ---------- 4.6 Mapa de Soluções ----------

export const SOLUTION_MAP = [
  ["Empresa com PABX físico antigo ou operadora tradicional cara", "Custo alto, pouca flexibilidade, sem gestão", "Onvox"],
  ["Empresa com equipe remota ou home office", "Comunicação descentralizada, sem controle", "Onvox"],
  ["Empresa que perde ligações ou não monitora atendimento telefônico", "Chamadas perdidas, sem métricas", "Onvox (Contact Center)"],
  ["Empresa que atende muito pelo WhatsApp e o número não escala", "1 número, 1 pessoa, fila de espera", "TakeFlow"],
  ["Empresa que quer automatizar respostas repetitivas no WhatsApp", "Time sobrecarregado com perguntas básicas", "TakeFlow (com fluxos ou IA)"],
  ["Empresa que quer disparar campanhas no WhatsApp de forma oficial", "Risco de bloqueio com ferramentas não oficiais", "TakeFlow (API Oficial)"],
  ["Empresa com time comercial que faz ligações e quer melhorar conversão", "Sem visibilidade sobre qualidade das calls", "evolu.AI"],
  ["Gestor que não consegue ouvir 100% das ligações do time", "Feedback subjetivo, inconsistente, tardio", "evolu.AI"],
  ["Empresa que quer replicar o padrão dos melhores vendedores", "Top performers não escaláveis", "evolu.AI"],
  ["Empresa que quer o ecossistema completo", "Comunicação + WhatsApp + inteligência de vendas", "Onvox + TakeFlow + evolu.AI"],
];

export const DIAGNOSTIC_QUESTIONS_ONVOX = [
  "Hoje vocês usam PABX físico ou operadora tradicional?",
  "Qual o custo mensal atual de telefonia?",
  "Vocês têm equipe remota ou filiais?",
  "Conseguem monitorar quantas chamadas são perdidas por dia?",
  "O time usa ramal fixo ou celular pessoal para atender clientes?",
];

export const DIAGNOSTIC_QUESTIONS_TAKEFLOW = [
  "Qual o principal canal de atendimento de vocês hoje?",
  "Quantas pessoas atendem no WhatsApp simultaneamente?",
  "Já perderam algum número de WhatsApp por bloqueio?",
  "Conseguem ver relatórios do que acontece no WhatsApp?",
  "Tem algum processo que poderia ser automatizado no atendimento?",
];

export const DIAGNOSTIC_QUESTIONS_EVOLUAI = [
  "Quantas ligações o time comercial faz por dia?",
  "Você consegue ouvir as ligações dos vendedores com regularidade?",
  "Como é o processo de feedback e coaching hoje?",
  "Você sabe quais etapas da venda seu time tem mais dificuldade?",
  "Seus melhores vendedores têm um padrão que o restante do time não replica?",
];

// ---------- 4.7 Business Case / ROI ----------

export const ONVOX_ROI_EXAMPLE = [
  ["42 ramais com Call Center + 1 DID", "—"],
  ["Custo atual do cliente", "R$ 1.722,00/mês"],
  ["Valor Onvox", "R$ 1.470,00/mês"],
  ["Economia mensal", "R$ 252,00"],
  ["Economia em 1 ano", "R$ 3.024,00"],
  ["Economia em 2 anos", "R$ 6.048,00"],
];

export const ONVOX_VALUE_ARGUMENTS = [
  "Eliminação de hardware físico (sem manutenção, sem obsolescência)",
  "Equipe remota e filiais unificadas em um único sistema",
  "Gravação de chamadas para treinamento e segurança jurídica",
  "Métricas de atendimento em tempo real para gestores",
  "Escalabilidade imediata — adicionar ramal em minutos, não dias",
  "Recepcionista Virtual com IA atendendo 24h/7 dias — sem custo de contratação",
];

export const TAKEFLOW_ROI_SCENARIO = [
  ["Recepcionista manual", "R$ 2.500,00–3.500,00", "Salário + encargos + benefícios. Atende em horário comercial."],
  ["TakeFlow IA N1 100/dia", "R$ 2.570,00", "1 conexão + 1 licença + IA. Atende 24h, 7 dias, sem faltas."],
];

export const TAKEFLOW_META_SAVINGS_EXAMPLE = [
  "5.000 confirmações (Utilidade) × R$ 0,04 = R$ 200,00",
  "3.000 disparos (Marketing) × R$ 0,40 = R$ 1.200,00",
  "Total Meta: R$ 1.400,00/mês",
  "Se todas fossem classificadas como Marketing: 8.000 × R$ 0,40 = R$ 3.200,00",
  "Economia com categorização correta: R$ 1.800,00/mês — R$ 21.600,00/ano",
];

export const EVOLUAI_ROI_CALC = [
  "Ligações por mês: 5 × 20 × 22 dias = 2.200 ligações",
  "Conversões atuais (15%): 330 negócios fechados",
  "Com aumento de 5 pp na conversão (20%): 440 negócios",
  "110 negócios a mais por mês",
  "Se ticket médio for R$ 500,00: R$ 55.000,00 de receita adicional/mês",
  "Custo da evolu.AI (plano Médio): R$ 1.197,00/mês",
  "ROI: retorno de 45x o investimento",
];

export const EVOLUAI_OTHER_ARGUMENTS = [
  "Elimina o custo de supervisores dedicados à escuta de chamadas",
  "Identifica imediatamente qual vendedor precisa de coaching prioritário",
  "Replica o padrão dos top performers para o time todo",
  "Gera dados objetivos para decisões de promoção e desligamento",
  "Reduz rotatividade ao fornecer desenvolvimento real e contínuo",
];

export const MODULE_4_SECTIONS = [
  { id: "m4-sec-1", label: "4.1 Portfólio Completo" },
  { id: "m4-sec-2", label: "4.2 API Oficial Meta" },
  { id: "m4-sec-3", label: "4.3 Precificação Onvox" },
  { id: "m4-sec-4", label: "4.4 Precificação TakeFlow" },
  { id: "m4-sec-5", label: "4.5 Precificação evolu.AI" },
  { id: "m4-sec-6", label: "4.6 Solução por Perfil de Cliente" },
  { id: "m4-sec-7", label: "4.7 Business Case e ROI" },
];
