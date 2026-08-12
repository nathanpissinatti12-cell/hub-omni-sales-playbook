// Conteúdo do Playbook de Vendas Omni Assessoria — Módulo 2 (Pré-vendas /
// SDR-BDR), transcrito de "Modulo2_PreVendas_Omni_Playbook.pdf". Conteúdo
// mantido fiel ao documento original — não editorializar números, scripts
// ou nomes de clientes sem nova fonte.

export const BDR_PROFILE = [
  { dimensao: "Experiência", perfil: "6 meses a 2 anos em pré-vendas B2B (SaaS, telecom, tecnologia). Vendedores de balcão de alto desempenho também se adaptam bem" },
  { dimensao: "Voz e oratória", perfil: "Empolgação no início e fim da ligação, calma e assertividade no meio. Boa dicção, ênfases controladas, segurança" },
  { dimensao: "Resiliência", perfil: "Capacidade de fazer 60–80 ligações/dia mantendo energia. Encara o 'não' como sinal, não como rejeição pessoal" },
  { dimensao: "Curiosidade comercial", perfil: "Pesquisa o lead no LinkedIn antes da ligação. Entende a vertical do prospect antes de discar" },
  { dimensao: "Disciplina de processo", perfil: "Registra rigorosamente no Meetime Flow. Cumpre cadência. Não deixa lead 'sumir'" },
  { dimensao: "Postura consultiva", perfil: "Vê-se como par do gestor, não como vendedor abaixo dele. Fala de igual para igual" },
  { dimensao: "Inteligência emocional", perfil: "Sabe ler o tom do gestor (impaciente, curioso, defensivo) e adapta a abordagem em tempo real" },
];

export const BDR_RED_FLAGS = [
  "Candidato que confunde BDR com telemarketing (\"eu já fiz vendas, já fui SAC\")",
  "Candidato sem disposição para aprender o produto tecnicamente (TakeFlow, Onvox e evolu.AI exigem domínio mínimo)",
  "Candidato que evita ligações ou prefere \"só mandar e-mail\"",
  "Candidato sem ambição de chegar a Closer/AE (BDR Omni precisa ter visão de carreira)",
];

export const PRE_CALL_CHECKLIST = [
  "Nome do gestor confirmado no LinkedIn",
  "Cargo correto (TI, Marketing, Comercial, CS, Operações)",
  "Tamanho aproximado da empresa (funcionários, lojas, unidades)",
  "Vertical e momento (expansão recente? aquisição? notícia relevante?)",
  "Site da empresa visitado — entender o que vendem e como vendem",
  "Hipótese de dor primária formada (ex: \"rede de 30 farmácias, provavelmente tem WhatsApp descentralizado nos celulares dos balconistas\")",
];

export const CADENCE = [
  { atividade: "1", dia: "D1", canal: "Pesquisa", descricao: "Pesquisa + LinkedIn" },
  { atividade: "2", dia: "D1", canal: "Ligação", descricao: "Cold call" },
  { atividade: "3", dia: "D1", canal: "WhatsApp", descricao: "1º WhatsApp (vertical específica)" },
  { atividade: "4", dia: "D3", canal: "Ligação", descricao: "2ª tentativa de ligação" },
  { atividade: "5", dia: "D3", canal: "WhatsApp", descricao: "2º WhatsApp (áudio/vídeo)" },
  { atividade: "6", dia: "D3", canal: "E-mail", descricao: "ICP Empresas que investem em tráfego digital" },
  { atividade: "7", dia: "D5", canal: "Ligação", descricao: "3ª tentativa" },
  { atividade: "8", dia: "D5", canal: "LinkedIn", descricao: "1º LinkedIn (vertical específica)" },
  { atividade: "9", dia: "D7", canal: "Ligação", descricao: "4ª tentativa" },
  { atividade: "10", dia: "D7", canal: "WhatsApp", descricao: "3º WhatsApp (SaaS)" },
  { atividade: "11", dia: "D9", canal: "Ligação", descricao: "5ª tentativa" },
  { atividade: "12", dia: "D9", canal: "LinkedIn", descricao: "2º LinkedIn (Mercado financeiro — último)" },
  { atividade: "13", dia: "D9", canal: "WhatsApp", descricao: "3º WhatsApp (ICP tráfego digital)" },
];

export const TEMPLATE_PATTERNS = [
  {
    title: "Campos dinâmicos personalizados",
    detail: "todos os templates usam variáveis {{firstName}}, {{company}}, {{salesman}} — o Meetime preenche automaticamente. Mantém escala sem abrir mão da personalização.",
  },
  {
    title: "Abertura sem pitch — conexão primeiro",
    detail: "nenhum template começa vendendo. O padrão é sempre: \"tenho acompanhado [contexto do mercado do lead]\" ou \"notei o trabalho que a {{company}} vem realizando\". Demonstra pesquisa prévia.",
  },
  {
    title: "Gancho de dor específico por vertical",
    detail: "cada template referencia dores do segmento. A vertical define o gancho, nunca dores genéricas.",
  },
  {
    title: "Proposta de valor em bullets curtos (2º e 3º contato)",
    detail: "a partir do 2º WhatsApp, listas de frentes de atuação em máximo 5 itens, sem linguagem técnica. O objetivo é ampliar reconhecimento de dor sem explicar o produto.",
  },
  {
    title: "CTA de baixo atrito — sempre opções binárias",
    detail: "\"Prefere terça às 14h ou quarta às 10h?\" — nunca \"quando você pode?\"",
  },
  {
    title: "Progressão de tom ao longo da cadência",
    detail: "1º contato: curioso, leve, sem pressão | 2º e 3º: mais direto, amplia valor | Último: encerramento honesto sem drama, deixa a porta aberta.",
  },
  {
    title: "O Raio-X / diagnóstico como CTA universal",
    detail: "em todos os templates, o call-to-action é sempre o diagnóstico gratuito de 15 minutos — nunca venda direta, nunca demo de produto.",
  },
];

export const CHANNEL_EFFORT = [
  { canal: "Telefone", meta: "1.000 minutos/mês ≈ 50 minutos falados/dia (60–80 tentativas de ligação)" },
  { canal: "E-mail", meta: "150/mês ≈ 7 por dia" },
  { canal: "WhatsApp", meta: "150/mês ≈ 7 por dia" },
  { canal: "LinkedIn", meta: "20 conexões/mês ≈ 1 por dia" },
];

export const AIDA_STAGES = [
  {
    stage: "Atenção",
    timing: "0–15 segundos — quebra de padrão",
    script: `"Fala, [Nome do Gestor], tudo bem? Aqui é o [Seu Nome], da Omni. Vi no LinkedIn que você é o responsável pela área de [TI / Tecnologia / Sistemas / Infraestrutura] da [Empresa], certo? Show! Te liguei, mas pode ficar tranquilo que não é para vender nada rsrs"`,
    why: [
      "Tom coloquial (\"Fala\", \"Show!\", \"rsrs\") rompe o padrão \"bom dia, sou da empresa X\"",
      "Confirmação do cargo via LinkedIn estabelece pesquisa prévia (autoridade)",
      "\"Não é para vender nada\" desarma o ego defensivo do gestor",
    ],
  },
  {
    stage: "Interesse",
    timing: "15–60 segundos — gancho da dor da vertical",
    script: `"Só pra você entender, [Nome do Gestor]: hoje a gente atua em parceria com TIs de farmácias e o que a gente vê é que tem uns pontos que sempre pegam pro TI: um deles é o atendimento dos clientes pelo WhatsApp. Quase sempre as conversas do WhatsApp ficam no celular do balconista, e em muitos casos os clientes ficam sem resposta ou demora muito até serem atendidos, porque a prioridade é o atendimento no balcão."

"Fora isso, a gente vê também que é comum grandes grupos de farmácia que ainda usam sistemas de telefonia fixa físicos – o que gera problemas técnicos e gestão mais complicada. E ainda a necessidade de implementar IA para padronizar o atendimento e aumentar a eficiência."

"E como estão suas ferramentas em relação a WhatsApp, telefonia em nuvem e IA, o que você possui hoje?"`,
    why: [
      "Aplica a técnica de Implicação do SPIN Selling — descrita no treinamento Omni 2026",
      "Aplica Empatia Tática: \"a culpa não é da equipe, é o volume / a estrutura\"",
      "Termina com pergunta aberta que força o gestor a se posicionar",
    ],
  },
  {
    stage: "Desejo",
    timing: "60–120 segundos — apresentação do ecossistema",
    script: `"Mas por que eu te liguei, [Nome do Gestor]? Nós desenvolvemos um projeto onde através de três ferramentas, conseguimos buscar maneiras de tornar seu trabalho mais fácil. Como eu consigo isso? A gente tem a:"

TakeFlow: nossa plataforma de WhatsApp com IA e chatbot. API aberta, ou seja, dá para plugar direto nos sistemas que vocês utilizam, para auditar e acompanhar as conversas em tempo real.

Onvox: plataforma de telefonia em nuvem. Com ramal externo via app no celular, computador ou aparelhos IP. Fora isso, podemos centralizar a comunicação de todas unidades em um só lugar.

evolu.AI: um sistema que analisa toda ligação e conversa do WhatsApp para dar notas ao atendimento do pessoal.`,
    why: [
      "Apresenta o ecossistema sem afogar o gestor em features",
      "Cada produto é descrito por resultado, não por funcionalidade técnica",
    ],
  },
  {
    stage: "Ação",
    timing: "120–180 segundos — diferencial, Success Fee e fechamento da reunião",
    script: `"O nosso diferencial é que não entregamos as 3 soluções de forma padrão. Nós realizamos um Raio-X na sua operação para entender, entre nossas mais de 200 funcionalidades, quais de fato trarão um ganho real pra sua operação, aí então personalizamos a entrega das soluções, somando tecnologia ao potencial da sua equipe. Na prática, vocês ganham 3 coisas: mais faturamento, melhor experiência do cliente e colaborador, e KPIs precisos para a sua tomada de decisão."

"E a grande vantagem de ser um parceiro da Omni é que esse Raio-X não gera nenhum custo para sua operação, porque aqui atuamos na modalidade Success Fee."

"Faz sentido agendarmos esse diagnóstico rápido, de uns 15 minutos, para avaliarmos o que se aplica na sua operação? Como fica a sua disponibilidade para [terça-feira, período da manhã] ou [quarta-feira, período da tarde]?"`,
    why: [
      "Posiciona a Omni acima de revendas e SaaS genéricos (Raio-X é exclusivo)",
      "Quantifica valor (mais faturamento + experiência + KPIs)",
      "\"Success Fee\" remove fricção financeira — só pagam se virmos valor",
      "Oferece duas alternativas de horário (técnica de \"alternativas falsas\") ao invés de \"quando você pode?\"",
      "As 5 perguntas pós-agendamento são o micro-Raio-X que abastece o closer e reforça compromisso",
      "O timing (15 min) é deliberadamente baixo para reduzir fricção — depois a reunião pode estender naturalmente",
    ],
  },
];

export const POST_BOOKING_QUESTIONS = [
  { q: "Hoje, o WhatsApp de vocês fica centralizado em alguma plataforma ou cada vendedor atende no próprio aparelho celular?", maps: "Mapeia centralização/risco" },
  { q: "Quantas pessoas vocês têm hoje na operação de atendimento, somando o time de vendas e pós-vendas?", maps: "Mapeia tamanho/ticket" },
  { q: "Vocês já utilizam alguma plataforma específica para o WhatsApp hoje? Qual?", maps: "Mapeia concorrência" },
  { q: "E qual é o CRM que vocês rodam a operação?", maps: "Mapeia integração" },
  { q: "Sobre as ligações: vocês usam telefonia em nuvem hoje ou ainda estão na linha comum?", maps: "Mapeia cross-sell Onvox" },
];

export const VERTICAL_PAIN = [
  { vertical: "Farmácias", dor: "WhatsApp no celular do balconista; telefonia fixa legada; necessidade de IA para padronizar atendimento" },
  { vertical: "Varejo multiloja", dor: "Comunicação descentralizada entre lojas; perda de leads no WhatsApp; sem gravação/auditoria" },
  { vertical: "Indústria/Logística", dor: "Telefonia fixa cara e engessada; falta de mobilidade; SAC sobrecarregado" },
  { vertical: "Concessionárias", dor: "CAC altíssimo desperdiçado por demora no atendimento; lead esfriando no WhatsApp" },
  { vertical: "Energia solar", dor: "Mesma dor de concessionária — lead caro perdendo qualidade na fila" },
  { vertical: "Educação (escolas)", dor: "Comunicação com pais via WhatsApp descentralizada; ausência de auditoria" },
  { vertical: "ISPs/Provedores", dor: "Jornada do assinante; escala no suporte; churn e retenção; automação financeira" },
];

export const EMAIL_PRINCIPLES = [
  "Curto: máximo de 120 palavras no corpo",
  "Personalizado: primeira linha sempre referência específica à empresa do prospect",
  "Um único CTA: reunião de 15 minutos. Nada mais",
  "Sem anexo na primeira tentativa: anexo de PDF aciona filtros e queima credibilidade",
  "Assinatura limpa: nome, cargo, Omni, telefone. Sem banner gigante",
];

export const EMAIL_TEMPLATES = [
  {
    title: "Template 1 — E-mail D3 (após primeira ligação não atendida)",
    subject: "[Nome] — 3 minutos sobre comunicação na [Empresa]",
    body: `[Nome], tentei te pegar pelo telefone hoje cedo.
Vi no LinkedIn que você cuida de [TI/Marketing/Comercial] na [Empresa]. Trabalhamos com gestores de [vertical] como Comvem, MAM Baby e Kangu, e o padrão que mais identificamos é: o WhatsApp acaba descentralizado no celular de cada vendedor/balconista, sem auditoria e com perda de leads silenciosa.
Não estou te oferecendo um software. Estou te propondo um Raio-X gratuito da sua operação de comunicação — em 15 minutos identificamos onde está vazando dinheiro.
Pode ser terça, 14h ou quarta, 10h?`,
  },
  {
    title: "Template 2 — E-mail D5 (insight de mercado)",
    subject: "Por que 85% das novas implementações em 2026 serão em nuvem",
    body: `[Nome], um dado que tem chamado nossa atenção:
Até o final de 2026, mais de 85% das novas implementações de telefonia corporativa no Brasil serão 100% em nuvem. E quem não migrar até lá vai operar com custo médio 40% a 60% mais alto que a concorrência.
A Omni acompanha esse movimento há 15 anos e já guiou empresas como British Council, Barco e ActionAid nessa migração. Nosso ponto de partida sempre é o mesmo: um Raio-X gratuito de 15 minutos da operação atual.
Topa marcarmos para semana que vem?`,
  },
  {
    title: "Template 3 — Breakup E-mail (D9)",
    subject: "Encerrando o ciclo, [Nome]",
    body: `[Nome], tentei te encontrar nos últimos dias por telefone, e-mail e LinkedIn — sem sucesso. Vou parar de incomodar. Mas antes, queria te deixar com uma pergunta:
Se a sua operação de WhatsApp + telefonia estivesse perdendo R$ 30k por mês em leads frios e excedentes invisíveis, você gostaria de saber?
Se a resposta for sim, é só responder este e-mail com "topo o Raio-X" e em 15 minutos te mostro.
Se não, sem problema — desejo sucesso na [Empresa]!`,
  },
];

export const LINKEDIN_MESSAGES = [
  { title: "Pedido de conexão (sem mensagem comercial)", text: `"Olá [Nome], vi seu perfil e o trabalho da [Empresa]. Atuo com gestores de [TI/Marketing] no segmento de comunicação corporativa. Bora trocar ideia por aqui?"` },
  { title: "Mensagem após conexão aceita (D+2 da conexão — D5 da cadência)", text: `"[Nome], obrigado pela conexão! Rapidamente: trabalhamos com [vertical] otimizando WhatsApp + telefonia + IA. Posso te enviar um insight rápido sobre o que temos visto em empresas do seu porte?"` },
  { title: "Mensagem direta — última tentativa (D9 da cadência)", text: `"[Nome], tentei te pegar por telefone e e-mail. Sei que sua agenda é puxada. Tenho uma janela de 15 min na quarta às 10h ou na quinta às 14h para te apresentar um Raio-X da operação de [Empresa]. Topa?"` },
];

export const WHATSAPP_MESSAGES = [
  { title: "WhatsApp 1 (D1 — após ligação não atendida)", text: `"Oi [Nome], aqui é o [BDR] da Omni — tentei falar com você essa semana. Pergunta rápida: hoje o WhatsApp de atendimento da [Empresa] roda numa plataforma centralizada ou nos celulares do time? É o ponto onde mais identificamos perda silenciosa de receita em [vertical]. Topa 15 min para te mostrar como mapear isso?"` },
  { title: "WhatsApp áudio/vídeo (D3)", text: "Envio de mensagem de voz (30–45 segundos) ou vídeo curto (até 60 segundos) reforçando o gancho de dor da vertical e propondo a reunião de diagnóstico. Tom: próximo, não formal. Objetivo: gerar curiosidade e humanizar o contato." },
  { title: "WhatsApp final (D9 — última tentativa)", text: `"[Nome], imagino que a rotina por aí esteja intensa. Essa é minha última tentativa de contato pelo WhatsApp. Queria muito te mostrar rapidamente como temos atuado como parceiros estratégicos de [vertical] para elevar a eficiência do atendimento, a experiência do cliente e a retenção da base. Topa um papo rápido hoje? Se não for o momento, sem problema nenhum. Fico à disposição para quando a agenda aliviar."` },
];

export const OBJECTIONS_M2 = [
  {
    question: "\"Já temos um sistema de WhatsApp / Já uso RD Station / Zenvia.\"",
    answer: "\"Que ótimo, [Nome]. Na verdade, as empresas que mais têm resultado com a nossa IA são justamente as que já usam outras ferramentas básicas. Mas me tira uma dúvida franca: a sua ferramenta hoje apenas organiza as conversas, ou ela já tem inteligência que atende, filtra o curioso e passa só o cliente quente para o vendedor em 3 segundos? Se a sua ferramenta ainda faz o seu cliente esperar ou passar por um robô irritante, vale 15 minutos comparar com o que construímos. Topa?\"",
  },
  {
    question: "\"Minha equipe é muito boa, respondemos rápido.\"",
    answer: "\"Se você consegue garantir que 100% dos leads são atendidos em menos de 5 minutos, parabéns, [Nome] — você é exceção no mercado. Mas como gestor, como você audita isso hoje? Tem um painel mostrando o tempo de espera exato de cada vendedor, ou confia no feeling da equipe? Minha proposta é simples: 15 minutos com nosso especialista. Se a sua operação já for mais rápida que nossa IA, eu não te ligo nunca mais. Topa o desafio?\"",
  },
  {
    question: "\"Manda a apresentação por e-mail.\"",
    answer: "\"Eu mando, [Nome], sem problema. Mas sendo direto: PDF não vai te mostrar a velocidade da ferramenta na prática, e sua caixa de entrada já é lotada. Como o seu tempo vale dinheiro, prefiro te mostrar a tela funcionando ao vivo. 15 minutos. Se em 15 minutos você achar que não serve para [Empresa], encerramos. Fica melhor amanhã de manhã ou no final da tarde?\"",
  },
  {
    question: "\"O mercado tá ruim, não estamos investindo.\"",
    answer: "\"Entendo, [Nome]. E é exatamente por isso que te liguei. Anunciar no Google ou Instagram está carríssimo. Eu não te liguei para te vender um custo novo, te liguei para te mostrar como estancar a sangria dos leads que você já pagou para ter e que estão esfriando na fila do WhatsApp. Se a nossa solução recuperar uma única venda que sua equipe perderia esta semana, o sistema se paga por meses. 15 min com nosso especialista para te mostrar essa matemática?\"",
  },
  {
    question: "\"É aquele robô de chatbot? Meu cliente odeia.\"",
    answer: "\"E o seu cliente tem razão, [Nome]! Nós também odiamos aqueles 'digite 1 para vendas, 2 para suporte'. O que fazemos é o oposto. Usamos IA semântica — o robô conversa com áudio, com botões naturais, parece humano fazendo a triagem. O cliente nem percebe que é máquina até o vendedor assumir. É exatamente essa experiência premium que quero te mostrar. Que horário fica melhor?\"",
  },
  {
    question: "\"Já tenho parceiro / gerente da operadora.\"",
    answer: "\"Legal, [Nome]. E ele te envia apenas condições da própria operadora, certo? Nosso trabalho é diferente: como temos acesso ao portfólio de várias operadoras e plataformas, conseguimos analisar todas as oportunidades e até comparar com o que seu gerente atual oferece. Você não precisa trocar nada se não fizer sentido — o Raio-X é gratuito e em 15 minutos você sai com a foto comparativa. Vale?\"",
  },
  {
    question: "\"Estou satisfeito com minha telefonia/operadora atual.\"",
    answer: "\"Que bom, [Nome]! Aliás, a maior parte dos nossos clientes começou exatamente assim — 'tá tudo certo'. O Raio-X serve justamente para verificar se não tem nenhuma brecha invisível. Por exemplo, serviços contratados que ninguém usa, excedentes recorrentes, taxas que somam R$ 2k/mês sem ninguém perceber. Em 15 min mapeamos isso. Se estiver tudo certo mesmo, ótimo — você sai com a tranquilidade documentada. Topa?\"",
  },
  {
    question: "\"Não tenho tempo agora / muito ocupado.\"",
    answer: "\"Imagino, [Nome] — gestor de [TI/Marketing] em [vertical] não para. Por isso vim com 15 minutos, não 1 hora. E pode ser inclusive no horário que sobra entre uma reunião e outra. Você prefere terça às 8h da manhã ou sexta às 18h, quando a agenda já tá afrouxando?\"",
  },
  {
    question: "\"Quanto custa?\" (objeção precoce de preço)",
    answer: "\"Boa, [Nome]. E é uma pergunta que vai depender 100% do que descobrirmos no Raio-X — porque o investimento varia conforme o número de ramais, volume de WhatsApp e quais módulos fazem sentido. O que posso te garantir agora é que o Raio-X é zero custo e que nosso modelo é Success Fee — só ganhamos quando você ganha. Vamos primeiro mapear, depois falamos de número?\"",
  },
  {
    question: "\"Manda só o material que eu analiso e te retorno.\"",
    answer: "\"Posso mandar, [Nome]. Mas honestamente — material genérico não vai te mostrar o que importa, que é o que se aplica especificamente à [Empresa]. Faço diferente: te mando o material depois dos 15 min, já personalizado com o que faz sentido pra vocês. Funciona melhor pra terça ou quarta?\"",
  },
];

export const QUALIFYING_BY_PRODUCT = [
  {
    product: "TakeFlow (WhatsApp + IA)",
    questions: [
      "O WhatsApp de vocês fica num número centralizado ou em vários celulares do time?",
      "Quando um lead chega fora do horário comercial, o que acontece?",
      "Você consegue ver hoje quantas conversas estão abertas e qual o tempo médio de resposta de cada atendente?",
      "Se um vendedor sair amanhã, o histórico dos clientes fica com a empresa ou vai embora com ele?",
    ],
  },
  {
    product: "Onvox (Telefonia em Nuvem)",
    questions: [
      "Vocês usam telefonia em nuvem hoje ou ainda têm estrutura física (PABX)?",
      "Quantos ramais vocês têm e quantas unidades/filiais?",
      "Hoje o time consegue atender e fazer ligações pelo celular com o número da empresa?",
      "Vocês têm acesso a relatórios de chamadas, gravações e tempo de espera em tempo real?",
      "Quanto vocês gastam hoje somando operadora, manutenção e equipamentos?",
    ],
  },
  {
    product: "evolu.AI (Auditoria Cognitiva)",
    questions: [
      "Hoje como você acompanha a qualidade das ligações e atendimentos do seu time?",
      "Você consegue ouvir todas as ligações ou só uma amostra?",
      "Quando um vendedor tem performance baixa, você consegue identificar exatamente onde está o gap — se é no rapport, na objeção, no fechamento?",
      "Como você replica o comportamento do seu melhor vendedor para o resto do time?",
    ],
  },
];

export const GPCT = [
  { etapa: "G — Goals", pergunta: "Vocês pretendem expandir a empresa, colaboradores?", mapeia: "Direção de crescimento" },
  { etapa: "G — Goals", pergunta: "Hoje seria uma prioridade melhorar a comunicação e reduzir os custos?", mapeia: "Prioridade interna" },
  { etapa: "G — Goals", pergunta: "Vocês estão com alguma meta para reduzir custos ou aumentar eficiência?", mapeia: "Pressão financeira atual" },
  { etapa: "P — Plans", pergunta: "Você já desenvolveu algum projeto para melhorar a comunicação?", mapeia: "Maturidade do projeto" },
  { etapa: "P — Plans", pergunta: "Tem alguém te auxiliando nessa frente hoje?", mapeia: "Concorrência / consultorias" },
  { etapa: "C — Challenges", pergunta: "Você já teve dificuldade com o atendimento via WhatsApp ou telefonia?", mapeia: "Dor real com ferramentas atuais" },
  { etapa: "C — Challenges", pergunta: "Como você faz hoje para auditar a qualidade do atendimento?", mapeia: "Falta de governança" },
  { etapa: "T — Timeline", pergunta: "Se apresentarmos uma solução que resolva esses problemas, isso seria prioridade agora?", mapeia: "Urgência real" },
  { etapa: "B — Budget", pergunta: "Você consideraria um investimento se a solução resolver tudo que mapeamos?", mapeia: "Disposição de investir" },
  { etapa: "A — Authority", pergunta: "Além de você, tem mais alguém que ajuda nessa tomada de decisão?", mapeia: "Stakeholders adicionais" },
  { etapa: "C — Consequences", pergunta: "Você concorda que se não resolver esses pontos, sua operação continua perdendo leads e receita?", mapeia: "Validação de dor" },
  { etapa: "I — Implications", pergunta: "Vamos resolver tudo isso então?", mapeia: "Compromisso de avançar" },
];

export const GPCT_APPLICATION = [
  "Durante a cold call (3–5 perguntas críticas): Goals 1 e 2 + Challenges + Authority = suficiente para decidir se passa para o closer.",
  "Pós-agendamento (5 perguntas de mapeamento): as 5 perguntas técnicas do script oficial (centralização WhatsApp, tamanho, plataforma atual, CRM, telefonia).",
  "Reunião de Raio-X (closer aprofunda): o closer assume as perguntas de Plans, Budget detalhado, Timeline e Implications.",
];

export const SAL_CRITERIA = [
  { n: "1", criterio: "ICP confirmado", como: "Empresa em uma das verticais-alvo: farmácia, varejo multiloja, indústria/logística, escola, concessionária, energia solar, ISP, ou empresa com 30+ colaboradores no atendimento" },
  { n: "2", criterio: "Decisor identificado", como: "Confirmado que o contato é o gestor responsável (TI, Marketing, Comercial, CS, Operações) ou tem autoridade direta sobre a comunicação" },
  { n: "3", criterio: "Dor reconhecida", como: "Gestor verbalizou pelo menos uma dor: WhatsApp descentralizado, telefonia física engessada, ausência de auditoria, custos altos, falta de governança" },
  { n: "4", criterio: "Timing válido", como: "Contrato atual com 16+ meses, OU dor aguda independente de contrato (insatisfação atual)" },
  { n: "5", criterio: "Reunião agendada com data e hora", como: "Não vale \"me liga semana que vem\" — tem que ter slot bloqueado na agenda" },
  { n: "6", criterio: "5 perguntas de mapeamento respondidas", como: "WhatsApp centralizado? Tamanho da operação? Plataforma atual? CRM? Telefonia atual?" },
  { n: "7", criterio: "Meetime Flow atualizado", como: "Todas as informações registradas no padrão Omni com campos obrigatórios preenchidos" },
];

export const MEETIME_TEMPLATE = `IDENTIFICAÇÃO DO LEAD
DATA – HORÁRIO DA LIGAÇÃO – NOME DO BDR
GESTOR: [Nome completo] | CARGO: [Cargo exato]
TELEFONE | E-MAIL | WHATSAPP | LINKEDIN
PRIORIDADE: [A / B / C] | PROBABILIDADE DE FECHAMENTO: [%]

DIAGNÓSTICO INICIAL (5 PERGUNTAS)
1. WhatsApp centralizado em plataforma OU celulares do time? → [Resposta]
2. Quantas pessoas no atendimento (vendas + pós-vendas)? → [Resposta]
3. Plataforma de WhatsApp atual? → [Resposta — concorrente identificado: SIM/NÃO]
4. CRM utilizado? → [Resposta]
5. Telefonia: nuvem ou linha comum? → [Resposta]

POTENCIAL DE PRODUTOS
TakeFlow (WhatsApp + IA): [SIM/NÃO + justificativa]
Onvox (Telefonia em Nuvem): [SIM/NÃO + justificativa]
evolu.AI (Auditoria Cognitiva): [SIM/NÃO + justificativa]

GPCT_BA_C&I CAPTURADO
Goals: [Resumo] | Plans: [Resumo] | Challenges: [Resumo]
Timeline: [Resumo] | Authority: [Decisores adicionais? Quem?]

AGENDAMENTO
Data: [DD/MM] | Horário: [HH:MM] | Closer designado: [Nome]
Participantes: [Quem participará da reunião]

EXCEÇÕES / OBSERVAÇÕES
[Informações relevantes — alertas de risco, contexto político interno, urgência específica]`;

export const HANDOFF_STEPS = [
  "BDR abre a reunião: quebra o gelo, cria clima de continuidade. O cliente já conhece o BDR, então a presença dele reduz fricção inicial.",
  "BDR apresenta o closer com autoridade: \"Esse é o [Nome], nosso especialista em [produto/área]. Ele vai conduzir o Raio-X com você.\"",
  "BDR faz o briefing em voz alta: resume em 60 segundos o que foi mapeado — vertical, dor principal, o que o gestor disse que era prioridade, perguntas que ficaram abertas.",
  "BDR passa a palavra ao closer e sai naturalmente: \"Deixo vocês com a palavra. Qualquer coisa, estou disponível.\"",
];

export const HANDOFF_WHY = [
  "Elimina o risco de o closer chegar \"frio\" para a reunião",
  "O cliente sente continuidade e profissionalismo — não precisa repetir o contexto",
  "O BDR reforça seu papel consultivo (não é só quem \"marcou a reunião\")",
  "Cria responsabilidade compartilhada: se o brief foi ruim, o BDR sabe",
];

export const LEAD_PRIORITY = [
  { prioridade: "🟢 A", criterio: "Dentro do ICP + contrato 16+ meses + 20+ ramais/linhas OU 50+ colaboradores no atendimento", acao: "Cadência agressiva — 5 ligações em 9 dias úteis. Prioridade máxima na fila do Meetime" },
  { prioridade: "🟡 B", criterio: "Dentro do ICP + contrato incerto + médio potencial", acao: "Cadência padrão (13 toques em 9 dias). Foco em descoberta e nutrição" },
  { prioridade: "🔴 C", criterio: "Fora do ICP OU baixo volume OU contrato < 12 meses sem dor aguda", acao: "Tratamento simplificado — 3 toques em 5 dias. Se não responder, sai da cadência" },
];

export const KPI_PRODUTIVIDADE = [
  { kpi: "Minutos falados", mensal: "1.000 minutos", diaria: "~50 min" },
  { kpi: "E-mails enviados", mensal: "150", diaria: "~7" },
  { kpi: "WhatsApp registrados", mensal: "150", diaria: "~7" },
  { kpi: "Conexões LinkedIn criadas", mensal: "20", diaria: "~1" },
  { kpi: "Leads conectados (alcançou o gestor)", mensal: "100 por período", diaria: "—" },
  { kpi: "Leads em conexão (em cadência)", mensal: "50 por período", diaria: "—" },
  { kpi: "Lead-time médio (cadência completa)", mensal: "25 dias", diaria: "—" },
];

export const KPI_EFICIENCIA = [
  { kpi: "Leads iniciados", meta: "150/mês", obs: "Volume de entrada na cadência" },
  { kpi: "Leads finalizados", meta: "150/mês", obs: "Volume de saída (positivo ou negativo)" },
  { kpi: "Oportunidades geradas (SAL)", meta: "30/mês", obs: "SALs aceitas pelo closer" },
  { kpi: "Taxa de conversão (sobre finalizado)", meta: "25%", obs: "(SAL / Leads finalizados)" },
  { kpi: "Taxa de no-show", meta: "< 20%", obs: "Leads que não compareceram à reunião" },
];

export const QUALITY_METRICS = [
  "Taxa de conversão SAL → MQL aceito pelo closer (meta: > 80%)",
  "Taxa de SAL → Proposta apresentada (meta: > 60%)",
  "Taxa de SAL → Cliente fechado (meta: > 15–20%)",
  "Tempo médio até primeira ligação após entrada na fila (meta: < 24h)",
  "Taxa de remarcação (reagendamento de Raio-X) (alerta se > 15%)",
  "Score médio das ligações na evolu.AI (meta definida pela gestão)",
];

export const CHECKLIST_SETUP = [
  "Meetime Flow configurado com todos os campos obrigatórios do template de SAL Omni",
  "Cadências oficiais criadas no Meetime Flow por vertical (9 dias, 13 toques)",
  "Fit Score configurado no Meetime por critérios Omni (cargo, porte, vertical, telefone/e-mail)",
  "Templates de e-mail oficiais carregados (D3, D5, Breakup D9)",
  "Templates de WhatsApp e LinkedIn oficiais aprovados (LGPD)",
  "Bina Inteligente do Meetime Dialer ativada (DDD local)",
  "Campos Obrigatórios para Ganho configurados no Meetime (bloqueio de SAL incompleta)",
  "Feedback de Oportunidade ativado para closers avaliarem qualidade dos leads",
  "Calendar dos closers integrado para agendamento direto pelo BDR",
  "evolu.AI integrada ao Meetime para análise automática das ligações dos BDRs",
  "Banco de objeções com respostas treinadas distribuído ao time",
];

export const CHECKLIST_ONBOARDING = [
  "Imersão Omni completa (institucional, produtos, mercado) — 3 dias",
  "Treinamento técnico em TakeFlow, Onvox e evolu.AI — 2 dias",
  "Shadow de 20 ligações com BDR Black/Platinum (madrinha/padrinho)",
  "Role-play da Abordagem Oficial Omni — mínimo 5 sessões",
  "Treinamento Meetime Flow: cadências, Dialer, Fit Score, registro de SAL",
  "Treinamento GPCT_BA_C&I com aplicação prática por produto",
  "1ª semana: 50% da meta de ligações",
  "2ª semana: 75% da meta",
  "3ª semana: 100% da meta",
  "Avaliação de 30 dias com análise de 5 ligações via evolu.AI",
];

export const CHECKLIST_ROTINA = [
  "Segunda — Planejamento (30 min): revisão de pipeline, distribuição de leads A/B/C",
  "Terça a Quinta — Operação: acompanhamento de KPIs diários no dashboard Meetime",
  "Quarta — Role-play (1h): simulação de objeções e ligações reais",
  "Sexta — Review semanal (1h): análise de KPIs, relatórios evolu.AI, top 3 ligações da semana, ajustes",
  "Sexta — 1:1 individual (30 min/BDR): feedback personalizado e plano de ação",
];

export const CHECKLIST_AUDITORIA = [
  "Revisar relatórios evolu.AI de 100% das ligações (score médio por BDR, pilares mais fracos)",
  "Auditar 10 SALs entregues por BDR (qualidade do registro no Meetime)",
  "Verificar taxa de conversão SAL → fechamento (sinal de qualidade do lead)",
  "Coletar feedback dos closers sobre qualidade do handoff",
  "Revisar taxa de no-show e identificar causas raiz",
  "Atualizar banco de objeções com novas que apareceram no mês",
];

export const CHECKLIST_TOOLS = [
  "Meetime Flow (Sales Engagement + Dialer)",
  "LinkedIn (pesquisa e conexão com decisores)",
  "evolu.AI (feedback das ligações)",
  "Headset profissional",
  "WhatsApp Business para envio profissional",
  "Acesso ao Google Calendar / Outlook dos closers",
];

export const ANTI_PLAYBOOK = [
  "Soar como telemarketing: \"Bom dia, sou da Omni Assessoria, ligo para apresentar nossas soluções...\" — desliga em 3 segundos.",
  "Dar palestra de produto: listar as 200 funcionalidades mata a venda. O BDR vende diagnóstico, não produto.",
  "Aceitar \"manda por e-mail\" passivamente: sempre tentar reverter para reunião.",
  "Marcar reunião sem mapear as 5 perguntas: closer recebe lead frio e o no-show dispara.",
  "Não pesquisar antes de ligar: o LinkedIn aberto na frente é não-negociável.",
  "Discutir preço na cold call: preço só na proposta. Na ligação, é Raio-X.",
  "Assumir que o \"não\" é definitivo: persistência estratégica é parte do DNA do BDR Omni.",
  "Esquecer do registro no Meetime Flow: lead não registrado = lead perdido.",
  "Tratar todos os leads igual: A/B/C existem por uma razão — esforço deve ser alocado por prioridade.",
  "Entrar na reunião sem fazer o briefing ao vivo: o handoff ao closer existe para garantir continuidade — não pular essa etapa.",
];

export const ORIGENS_M2_OFICIAIS = [
  "Abordagem oficial AIDA + Ação (extraída integralmente do documento \"Abordagem para ser revisada\")",
  "Diferencial Raio-X + Success Fee (treinamento Omni 2026 e abordagem oficial)",
  "Ecossistema TakeFlow + Onvox + evolu.AI (treinamento Omni 2026 atualizado + propostas comerciais)",
  "Pilares de prospecção: Challenger Sale, Implicação SPIN, Pattern Interrupt, Empatia Tática, Micro-Comprometimento (treinamento Omni 2026)",
  "Banco de objeções (treinamentos de Prospecção 2026 e Inside Sales, adaptados ao ecossistema atual)",
  "Framework GPCT_BA_C&I adaptado por produto (documento GPCT_BA_C&I.docx + propostas TakeFlow, Onvox, evolu.AI)",
  "KPIs e metas de produtividade/eficiência (treinamento Prospecção 2026)",
  "Modelo OTE com faixas de performance (planilha PLANILHA_OTE_-_PRE-VENDAS_-_OMNI.xlsx)",
  "Cadência oficial Omni: 9 dias, 13 toques (Meetime Flow — capturas de tela)",
  "Padrões de template de abordagem: 7 padrões (documento de cadência de ISPs)",
  "Passagem de bastão ao vivo na reunião (formato atualizado conforme orientação direta)",
  "Meetime Flow como ferramenta oficial de Sales Engagement (documento Meetime Guide)",
];

export const ORIGENS_M2_EXTERNAS = [
  "Challenger Sale e Pattern Interrupt: referência ao livro The Challenger Sale (Dixon & Adamson), aplicada ao contexto Omni",
  "Estrutura de cold e-mail (breakup, insight de mercado): referência HubSpot e Outreach",
  "Conceito SAL (Sales Accepted Lead) e SLA de handoff: referência Salesforce Sales Cloud e operações enterprise B2B",
  "Indicadores de qualidade de handoff (taxa SAL → Proposta, SAL → Cliente fechado): referência HubSpot Sales Hub e práticas de RevOps modernas",
  "Estrutura de role-play semanal e shadowing: referência Salesforce/Twilio enablement programs",
];

export const ATTENTION_M2 = [
  "CRM dos closers não confirmado: o Meetime Flow envia oportunidades ao CRM, mas a ferramenta usada pelos closers para gestão de pipeline não foi definida neste módulo. Necessário confirmar (HubSpot, Pipedrive ou outro) para integrar com o Módulo 3.",
  "Templates de WhatsApp por vertical: apenas o template de ISPs (provedores) foi documentado integralmente. As demais verticais (farmácias, varejo, concessionárias, energia solar, indústria) têm apenas o gancho de dor mapeado. Os templates completos precisam ser criados e carregados no Meetime.",
  "Configuração do Fit Score no Meetime: os critérios de pontuação de leads (0–10) que a Omni usará não foram definidos. Sugestão: mapear em sessão específica com gestão (ex: cargo do decisor, vertical, número de funcionários, presença de PABX físico, tem e-mail corporativo, etc.).",
  "SLA de resposta a leads inbound: a Omni tem 5% de volume inbound. Não foi definido o tempo máximo de resposta (SLA) para esses leads nem como o Meetime os prioriza na fila do BDR.",
  "Critérios de perda automática na cadência: o Meetime permite configurar quantos dias após a última atividade sem contato o lead é marcado automaticamente como perdido. Esse parâmetro ainda não foi definido para a operação Omni.",
  "Motivos de perda personalizados no Meetime: a classificação dos leads perdidos (ex: \"Sem timing\", \"Fora do ICP\", \"Decisão postergada\", \"Competidor escolhido\") precisa ser mapeada e configurada para alimentar os dados de inteligência da operação.",
  "Processo de geração e enriquecimento de leads: o Módulo 2 pressupõe que os leads já estão disponíveis para a cadência, mas o processo de geração de listas (fontes, ferramentas, critérios de seleção) não foi documentado.",
  "Processo de no-show: o que o BDR faz quando o lead não aparece na reunião agendada não foi detalhado (scripts de remarcação, número de tentativas, critério para descartar).",
  "Integração evolu.AI com Meetime Dialer: a análise automática das ligações dos BDRs depende da integração entre o Dialer do Meetime e a evolu.AI. Isso foi mencionado como recomendação mas precisa ser validado tecnicamente.",
  "Script de inbound (5% do volume): a abordagem oficial foi desenvolvida para outbound. Para o volume inbound (leads que chegam pela Omni), o script de recepção e qualificação não foi desenvolvido.",
];

export const MODULE_2_SECTIONS = [
  { id: "m2-sec-1", label: "2.1 Contexto e Filosofia" },
  { id: "m2-sec-2", label: "2.2 Perfil Ideal do BDR" },
  { id: "m2-sec-3", label: "2.3 Prospecção Outbound" },
  { id: "m2-sec-4", label: "2.4 Abordagem Oficial (Cold Call)" },
  { id: "m2-sec-5", label: "2.5 Cold E-mail" },
  { id: "m2-sec-6", label: "2.6 LinkedIn e WhatsApp" },
  { id: "m2-sec-7", label: "2.7 Tratamento de Objeções" },
  { id: "m2-sec-8", label: "2.8 Qualificação GPCT_BA_C&I" },
  { id: "m2-sec-9", label: "2.9 SAL e Handoff" },
  { id: "m2-sec-10", label: "2.10 Prioridade de Leads (A/B/C)" },
  { id: "m2-sec-11", label: "2.11 Métricas e KPIs" },
  { id: "m2-sec-12", label: "2.12 Checklist de Implementação" },
  { id: "m2-sec-13", label: "2.13 Erros Comuns (Antiplaybook)" },
  { id: "m2-sec-14", label: "Procedência e Pontos de Atenção" },
];
