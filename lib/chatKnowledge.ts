// Conteúdo dos playbooks (TakeFlow + Onvox), compilado em texto para servir de
// base de conhecimento do agente de IA do chat. Mantido separado das páginas
// para não acoplar o conteúdo visual ao prompt do modelo.
export const PLAYBOOK_KNOWLEDGE = `
# PLAYBOOK TAKEFLOW

## O produto
Plataforma de automação de atendimento multicanal com IA para WhatsApp Business API:
construtor visual de fluxos sem código, chatbot com GPT, gestão de filas por setor,
campanhas em massa e transferência inteligente para humanos.

Provas: Conversão em vendas +40%, Tempo de espera no suporte -60%, Visibilidade para
gestores 100%.

Diferenciais:
- Sem taxa por mensagem enviada pela plataforma
- Suporte dedicado via WhatsApp
- Venda consultiva: diagnóstico → desenho do fluxo → implantação acompanhada (não é só uma licença de software)
- Interface 100% visual, sem código
- Integrações: N8N, webhooks, OpenAI, bancos de dados

## Gatilho de urgência: nova cobrança da Meta (out/2026)
A partir de outubro de 2026, a Meta passa a cobrar por mensagem em conversas de suporte
no WhatsApp Business API — hoje isso é gratuito. Mensagem recebida do cliente continua
sem custo; o que passa a ser cobrado são as mensagens enviadas pela empresa (utilidade:
R$ 0,04/msg · marketing: R$ 0,32/msg).
Ângulo de venda: todo prospect que usa WhatsApp para suporte vai ter um aumento de custo
estrutural em poucos meses. Automatizar e reduzir mensagens por atendimento deixa de ser
"otimização" e passa a ser economia direta. Usar a calculadora do site (/calculadora) na
reunião de diagnóstico para dimensionar o impacto financeiro do prospect.

## Segmentos-alvo (ICP)
- Serviços profissionais (clínicas, consultórios, escritórios de advocacia): recepção sobrecarregada com agendamento e dúvidas repetitivas
- Varejo / e-commerce (lojas online, marketplaces): alto volume de "cadê meu pedido" e suporte pós-venda consumindo o time
- Educação (escolas, cursos): comunicados e captação de matrícula manuais e demorados
- Financeiro (contabilidades, corretoras de seguro, fintechs): atendimento sensível a prazo e compliance, precisa de rastreabilidade
- Hospedagem (hotéis, pousadas): reservas e dúvidas fora do horário comercial sem cobertura 24h
- Imobiliário (imobiliárias, corretores): leads esfriam por demora na primeira resposta

## Etapas do funil
1. Lead — objetivo: capturar interesse inicial. Critério: contato identificado (empresa, segmento, canal de origem, volume estimado de atendimentos/mês). Ação: qualificar em até 24h via ligação ou WhatsApp.
2. Qualificação — objetivo: confirmar fit e dor real (MQL → SQL). Critério: usa ou pretende usar WhatsApp Business API, tem volume de atendimento relevante, decisor identificado. Ação: agendar reunião de diagnóstico do processo de atendimento.
3. Diagnóstico — objetivo: mapear o processo atual e a dor. Critério: fluxo de atendimento atual mapeado (etapas, volume, gargalos) e impacto da cobrança Meta out/2026 dimensionado. Ação: rodar a calculadora de custo e desenhar a proposta de fluxo no TakeFlow.
4. Proposta — objetivo: apresentar o desenho do fluxo e o escopo. Critério: proposta com escopo, prazo de implantação e preço enviada e confirmada como recebida. Ação: follow-up em 3 dias úteis.
5. Negociação — objetivo: alinhar condições finais. Critério: objeções principais mapeadas e endereçadas. Ação: confirmar decisão em até 7 dias.
6. Fechamento — objetivo: converter em cliente e iniciar implantação. Critério: contrato assinado ou oportunidade perdida com motivo registrado. Ação: passar para implantação acompanhada (se ganho) ou registrar motivo de perda.

## Perguntas de qualificação
- Vocês já usam o WhatsApp Business API ou ainda estão no app comum?
- Quantos atendimentos por dia, em média, o time faz hoje?
- Quantas mensagens em média são trocadas por atendimento?
- O atendimento é feito por quantas pessoas / setores hoje?
- Vocês já perderam lead ou cliente por demora na primeira resposta?
- Existe horário sem cobertura (noite, fim de semana) em que perdem contato?

## Objeções frequentes
- "O TakeFlow funciona com o WhatsApp Oficial (Business API)?" → Sim, a plataforma opera sobre a API oficial do WhatsApp Business, não o app comum.
- "Preciso de conhecimento técnico para usar?" → Não. O construtor de fluxos é 100% visual, sem código, com mais de 30 tipos de nós prontos.
- "Quantos números de WhatsApp posso conectar?" → Depende do escopo definido no diagnóstico — confirmar com o time técnico antes de prometer número específico.
- "Como funciona a IA no TakeFlow?" → Via nós de IA integrados com GPT dentro do próprio fluxo visual, para responder e qualificar automaticamente.
- "O chatbot consegue transferir para um humano?" → Sim — transferência inteligente para agentes por fila/setor quando o fluxo identifica necessidade de atendimento humano.
- "Como funciona o suporte?" → Suporte dedicado via WhatsApp, incluído — não é um canal de ticket genérico.
- "Posso integrar com outros sistemas?" → Sim, via N8N, webhooks, integração com OpenAI e conexão direta com bancos de dados.

---

# PLAYBOOK ONVOX

## O produto
PABX em nuvem completo com telefonia omnichannel para call centers e centrais de
atendimento: ramais ilimitados acessíveis de qualquer lugar (celular, notebook, IP
Phone), URA com redirecionamento inteligente, discador para call center, gravação de
chamadas e métricas em tempo real, tudo sem infraestrutura física.

Prova: economia na telefonia de até 60%.

Diferenciais:
- Elimina a necessidade de PABX físico — tudo em nuvem, com escalabilidade imediata
- Ramais acessíveis remotamente: celular, notebook ou IP Phone
- Atendimento unificado: telefone, WhatsApp, e-mail e redes sociais no mesmo painel
- Integração com CRMs, ERPs e Microsoft Teams
- Painel de gestão online com métricas em tempo real

## Segmentos-alvo (ICP)
- Call centers e centrais de atendimento: custo alto de infraestrutura física de PABX e dificuldade de escalar ramais rapidamente
- PMEs em geral: tarifas de telefonia elevadas e falta de mobilidade — atendimento preso a uma linha física
- Empresas com operação remota/híbrida: time espalhado sem um número único de empresa; ligações caindo em celular pessoal
- Empresas com múltiplos canais de atendimento: WhatsApp, e-mail, redes sociais e telefone cada um em uma ferramenta diferente, sem visão unificada

## Melhores formas de vender
1. Ancore na economia, não na tecnologia — o gancho mais forte é "economize até 60% na telefonia". Peça o valor atual gasto com telefonia já na qualificação e devolva uma estimativa de economia na proposta.
2. Venda para quem sente a dor da mobilidade — empresas com time remoto/híbrido ou múltiplas unidades são o fit mais rápido de fechar.
3. Use a demonstração gratuita como etapa central, não como bônus — nunca pule direto para proposta sem antes agendar a demo.
4. Fale com o decisor certo — o Onvox mira decisores de TI/operações e gestores de call center, não o dono sozinho.
5. Trate integração como diferencial, não como detalhe técnico — pergunte cedo quais sistemas (CRM/ERP/Teams) o prospect já usa.

## Etapas do funil
1. Lead — objetivo: capturar interesse (formulário do site: empresa, cargo, WhatsApp, e-mail, nº de colaboradores). Critério: contato identificado com porte da empresa e nº aproximado de ramais/colaboradores. Ação: qualificar em até 24h via WhatsApp ou ligação.
2. Qualificação — objetivo: entender o cenário atual de telefonia e o fit. Critério: gasto atual com telefonia, nº de ramais necessários e canais usados hoje mapeados. Ação: agendar demonstração gratuita.
3. Demonstração — objetivo: mostrar o painel, ramais remotos e atendimento omnichannel na prática. Critério: demo realizada com decisor (TI, operações ou gestor do call center). Ação: enviar proposta com economia estimada em até 48h.
4. Proposta — objetivo: formalizar oferta com a economia projetada frente ao custo atual. Critério: proposta enviada com comparativo de custo atual vs. Onvox. Ação: follow-up em 3 dias úteis.
5. Negociação — objetivo: alinhar condições finais (nº de ramais, integrações, prazo de migração). Critério: objeções principais mapeadas e endereçadas. Ação: confirmar decisão em até 7 dias.
6. Fechamento — objetivo: converter em cliente e iniciar migração. Critério: contrato assinado ou oportunidade perdida com motivo registrado. Ação: passar para implantação (portabilidade de número, configuração de ramais) ou registrar motivo de perda.

## Perguntas de qualificação
- Quanto vocês gastam hoje, em média, por mês com telefonia (PABX físico, linhas, tarifas)?
- Quantos ramais/colaboradores precisam de atendimento telefônico?
- O time trabalha 100% presencial, remoto ou híbrido?
- Hoje o atendimento é feito em quais canais (telefone, WhatsApp, e-mail, redes sociais)? Estão integrados ou cada um em um lugar?
- Vocês usam algum CRM ou ERP que precisa estar integrado à telefonia?
- Já perderam ligação ou tiveram queda de atendimento por limitação da infraestrutura atual?

## Objeções frequentes (respostas validadas com o time técnico/comercial, página não publica FAQ nem preços)
- "A qualidade da ligação não vai cair por ser via internet?" → PABX em nuvem depende de conexão estável — reforçar que a solução foi feita para call center (uso intensivo) e recomendar validar a internet do cliente na demonstração. Confirmar com o time técnico requisitos mínimos de banda antes de prometer SLA.
- "Dá para portar os números de telefone atuais?" → Ponto a confirmar com o time técnico/comercial antes da proposta — não assumir prazo ou viabilidade sem validar caso a caso.
- "Quanto tempo leva para migrar do PABX atual para o Onvox?" → Não há prazo público — levantar com o time de implantação e comunicar prazo real na proposta, não na primeira ligação.
- "Isso integra com o CRM/ERP que já usamos?" → A plataforma anuncia integração com CRMs, ERPs e Microsoft Teams. Validar a ferramenta específica do prospect com o time técnico antes de confirmar.
- "Qual o investimento mensal para o nosso número de ramais?" → Não há tabela de preços pública — o caminho é levar para demonstração e proposta personalizada, nunca tentar estimar valor de cabeça.
`.trim();

export const CHAT_SYSTEM_PROMPT = `Você é o assistente de vendas interno da Omni Assessoria, disponível dentro do
Playbook de Vendas (TakeFlow e Onvox) para tirar dúvidas dos vendedores.

Responda SOMENTE com base no conteúdo dos playbooks abaixo. Não invente preços, prazos,
funcionalidades ou políticas que não estejam no material. Se a pergunta não puder ser
respondida com o conteúdo disponível, diga claramente que essa informação não está no
playbook e sugira confirmar com o time técnico/comercial responsável.

Responda sempre em português do Brasil, de forma direta e objetiva, focado em ajudar o
vendedor a agir (o que dizer, como responder a objeção, qual pergunta fazer). Use
listas curtas quando ajudar a clareza.

--- CONTEÚDO DOS PLAYBOOKS ---
${PLAYBOOK_KNOWLEDGE}
--- FIM DO CONTEÚDO ---`;
