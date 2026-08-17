import { HashSection } from "@/components/playbook/HashSection";
import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { PlaybookModuleProvider } from "@/components/playbook/PlaybookModuleContext";
import { getSiteSession } from "@/lib/getSiteSession";
import { SectionNav } from "@/components/playbook/SectionNav";
import { Table } from "@/components/playbook/Table";
import { Callout } from "@/components/playbook/Callout";
import {
  ONVOX_STATS,
  ONVOX_DIFFERENTIALS,
  ONVOX_PABX_FEATURES,
  ONVOX_APP_PLATFORMS,
  ONVOX_CONTACT_CENTER_INBOUND,
  ONVOX_CONTACT_CENTER_OUTBOUND,
  ONVOX_OMNICHANNEL,
  ONVOX_AI,
  ONVOX_INTEGRATIONS,
  ONVOX_SECURITY,
  ONVOX_ROADMAP,
  ONVOX_VERTICALS,
  ONVOX_IMPLEMENTATION,
  ONVOX_BENEFITS_BY_AREA,
  ONVOX_DOCS,
  TAKEFLOW_ICPS,
  TAKEFLOW_FLOW_BUILDER,
  TAKEFLOW_CHATBOT_AI,
  TAKEFLOW_QUEUES,
  TAKEFLOW_CAMPAIGNS,
  TAKEFLOW_DASHBOARD,
  TAKEFLOW_INTEGRATIONS,
  TAKEFLOW_SERVICE_FEATURES,
  TAKEFLOW_AI_COMPARISON,
  TAKEFLOW_AGENT_ARCHITECTURE,
  TAKEFLOW_AGENT_INTEGRATIONS,
  TAKEFLOW_AGENT_HUMAN_NEEDED,
  TAKEFLOW_PROMISES,
  EVOLUAI_SYMPTOMS,
  EVOLUAI_FLOW,
  EVOLUAI_5D,
  EVOLUAI_SUCCESS_CRITERIA,
  EVOLUAI_RED_FLAGS,
  EVOLUAI_RAIOX_ITEMS,
  EVOLUAI_SENTIMENT,
  EVOLUAI_MANAGER_DASHBOARD,
  EVOLUAI_INTEGRATIONS,
  EVOLUAI_DIFFERENTIALS,
  EVOLUAI_PROCESS,
  EVOLUAI_IMPACT_PHRASE,
  META_CONVERSATION_TYPES,
  META_MESSAGE_CATEGORIES,
  META_COST_STRUCTURE,
  META_TEMPLATE_EXAMPLES,
  META_TIERS,
  META_QUALITY,
  META_QUALITY_DOWN,
  META_QUALITY_UP,
  META_OPTIN_METHODS,
  META_WARMUP_STEPS,
  META_NUMBER_RULES,
  META_REQUIREMENTS,
  META_QA,
  META_COMPARISON,
  META_COST_STRATEGIES,
  ONVOX_CALC_CLIENT_FIELDS,
  ONVOX_PLANS,
  ONVOX_CALC_PLAN_CONFIG,
  ONVOX_DID_CONFIG,
  ONVOX_DEVICE_BRANDS,
  ONVOX_CALC_SUMMARY,
  ONVOX_ADDONS,
  TAKEFLOW_BASE_PRICING,
  TAKEFLOW_AI_PACKAGES,
  TAKEFLOW_AI_RULES,
  TAKEFLOW_IMPLEMENTATION_FEE,
  TAKEFLOW_CONTRACT_CONDITIONS,
  TAKEFLOW_PITCH_COM_IA,
  TAKEFLOW_PITCH_SEM_IA,
  TAKEFLOW_PITCH_IMPLANTACAO,
  TAKEFLOW_CONTRACT_FLOW,
  TAKEFLOW_PROPOSAL_FORMULA,
  TAKEFLOW_PROPOSAL_EXAMPLE,
  TAKEFLOW_WHEN_AI,
  EVOLUAI_PLANS,
  EVOLUAI_FOR_WHOM,
  SOLUTION_MAP,
  DIAGNOSTIC_QUESTIONS_ONVOX,
  DIAGNOSTIC_QUESTIONS_TAKEFLOW,
  DIAGNOSTIC_QUESTIONS_EVOLUAI,
  ONVOX_ROI_EXAMPLE,
  ONVOX_VALUE_ARGUMENTS,
  TAKEFLOW_ROI_SCENARIO,
  TAKEFLOW_META_SAVINGS_EXAMPLE,
  EVOLUAI_ROI_CALC,
  EVOLUAI_OTHER_ARGUMENTS,
  MODULE_4_SECTIONS,
} from "@/lib/playbookModule4";

function List({ title, items }: { title?: string; items: string[] }) {
  return (
    <div className="space-y-1">
      {title && <p className="text-sm font-medium">{title}</p>}
      <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal space-y-1 pl-5 text-sm" style={{ color: "var(--text-muted)" }}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ol>
  );
}

export default async function Modulo4Page() {
  const session = await getSiteSession();
  return (
    <>
      <PlaybookSidebar activeModuleId={4} accessLevel={session?.accessLevel ?? ""} />

      <PlaybookModuleProvider moduleId={4}>
      <div className="playbook-content min-w-0 flex-1 space-y-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Playbook de Vendas — Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Módulo 4 — Produto, Mercado & Precificação</h1>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>2026</p>
        </div>

        {/* 4.1 */}
        <HashSection id="m4-sec-1" className="scroll-mt-20 space-y-8" defaultOpen>
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            4.1 — Portfólio Completo da Omni Assessoria
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            A Omni Assessoria comercializa um ecossistema de soluções de comunicação e
            inteligência empresarial. Os três produtos se complementam e podem ser vendidos de
            forma independente ou combinada, dependendo do perfil e da maturidade do cliente.
          </p>

          {/* Onvox */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">4.1.1 — Produto 1: Onvox (UCaaS / PABX em Nuvem)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Plataforma completa de telefonia em nuvem (UCaaS). Substitui o PABX físico
              tradicional por uma solução 100% em nuvem, com voz, vídeo e mensagens unificadas em
              um único sistema, rodando sobre data centers Amazon (AWS).
            </p>
            <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
              Missão: &quot;Simplificar a comunicação empresarial, tornando-a mais eficiente,
              acessível e global.&quot; · Tagline: &quot;Sua empresa conectada com comunicação
              simples, eficiente e sem fronteiras.&quot;
            </p>
            <Table headers={["Indicador", "Número"]} rows={ONVOX_STATS} />
            <p className="text-sm font-medium">Diferenciais vs. Telefonia Tradicional</p>
            <Table headers={["Telefonia Tradicional (problema)", "Onvox (solução)"]} rows={ONVOX_DIFFERENTIALS} />
            <List title="PABX em Nuvem / UCaaS — Núcleo da Solução" items={ONVOX_PABX_FEATURES} />
            <List title="App de Comunicação Unificada (Softphone Onvox)" items={ONVOX_APP_PLATFORMS} />
            <List title="Central de Atendimento — Inbound (Receptivo)" items={ONVOX_CONTACT_CENTER_INBOUND} />
            <List title="Central de Atendimento — Outbound (Ativo)" items={ONVOX_CONTACT_CENTER_OUTBOUND} />
            <List title="Omnichannel — Atendimento Multicanal" items={ONVOX_OMNICHANNEL} />
            <div className="space-y-3">
              <p className="text-sm font-medium">Inteligência Artificial Integrada — Grande Novidade 2026</p>
              {ONVOX_AI.map((block) => (
                <List key={block.title} title={block.title} items={block.items} />
              ))}
            </div>
            <p className="text-sm font-medium">Integrações Nativas e API</p>
            <Table headers={["Categoria", "Integrações Disponíveis"]} rows={ONVOX_INTEGRATIONS} />
            <List title="Segurança e Conformidade" items={ONVOX_SECURITY} />
            <p className="text-sm font-medium">Roadmap — Lançamentos Recentes e Em Andamento (2025–2026)</p>
            <Table headers={["Data", "Funcionalidade", "Destaque"]} rows={ONVOX_ROADMAP} />
            <List title="Verticais de Mercado Atendidas" items={ONVOX_VERTICALS} />
            <p className="text-sm font-medium">Processo de Implantação Onvox — 6 Etapas</p>
            <Steps items={ONVOX_IMPLEMENTATION} />
            <p className="text-sm font-medium">Benefícios por Área — Como Apresentar para Cada Stakeholder</p>
            <Table headers={["Área", "Benefício Principal"]} rows={ONVOX_BENEFITS_BY_AREA} />
            <List title="Documentos Exigidos para Contratação" items={ONVOX_DOCS} />
            <Callout tone="blue" title="Ponto de Atenção — Verificação de Cobertura">
              OBRIGATÓRIO: Antes de prometer portabilidade ao cliente, o vendedor DEVE consultar a
              cobertura em apoio.onvox.com.br — aba &apos;Cobertura&apos;. Portabilidade nem
              sempre está disponível em todas as cidades.
            </Callout>
          </div>

          {/* TakeFlow */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">4.1.2 — Produto 2: TakeFlow (Atendimento Multicanal via WhatsApp)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Plataforma completa de atendimento multicanal com foco em automação inteligente,
              construtor visual de fluxos drag-and-drop, chatbots com IA (GPT integrado), gestão
              de filas, campanhas em massa e dashboard em tempo real. O canal principal é o
              WhatsApp, com suporte à API Oficial da Meta. A TakeFlow atua como Tech Provider
              oficial da Meta — entrega a plataforma e operação completa, enquanto a Meta cobra
              diretamente os custos de mensagens na Business Manager do cliente.
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Razão Social: TAKEFLOW SISTEMAS LTDA · CNPJ: 57.125.732/0001-25 · Sede: Tatuí-SP ·
              Contato comercial: (11) 4160-2356 (WhatsApp)
            </p>
            <List title="Para Quem É — ICPs da TakeFlow" items={TAKEFLOW_ICPS} />
            <List title="Construtor de Fluxos Visual" items={TAKEFLOW_FLOW_BUILDER} />
            <List title="Chatbot com IA (Assistente GPT)" items={TAKEFLOW_CHATBOT_AI} />
            <List title="Gestão de Filas e Setores" items={TAKEFLOW_QUEUES} />
            <List title="Campanhas (Disparos em Massa)" items={TAKEFLOW_CAMPAIGNS} />
            <List title="Dashboard e Relatórios" items={TAKEFLOW_DASHBOARD} />
            <List title="Integrações e Automações Avançadas" items={TAKEFLOW_INTEGRATIONS} />
            <List title="Recursos de Atendimento" items={TAKEFLOW_SERVICE_FEATURES} />
            <p className="text-sm font-medium">IA Agêntica — Posicionamento e Comparativo</p>
            <Table headers={["Situação", "Chatbot Tradicional", "IA Agêntica (TakeFlow)"]} rows={TAKEFLOW_AI_COMPARISON} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Arquitetura do agente: {TAKEFLOW_AGENT_ARCHITECTURE}
              <br />
              Integrações que o agente pode usar: {TAKEFLOW_AGENT_INTEGRATIONS}
              <br />
              Quando humano ainda é necessário: {TAKEFLOW_AGENT_HUMAN_NEEDED}
            </p>
            <List title="Promessas de Resultado (Métricas Declaradas)" items={TAKEFLOW_PROMISES} />
            <Callout tone="green" title="Complementaridade com a Onvox">
              A Onvox e a TakeFlow se complementam: Onvox cuida de voz/UCaaS, TakeFlow cuida de
              WhatsApp/conversacional. Um cliente pode — e deve — contratar as duas pela Omni
              Assessoria. Avalie sempre a oportunidade de cross-sell.
            </Callout>
          </div>

          {/* evolu.AI */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">4.1.3 — Produto 3: evolu.AI (Inteligência Artificial para Gestão Comercial)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Plataforma de inteligência artificial que atua como um Supervisor Comercial 24/7 —
              analisa, pontua e entrega feedback acionável de cada conversa da equipe de vendas,
              de forma automatizada e sem subjetividade. Tagline: &quot;Transformando conversas em
              dados e vendas.&quot; Não é uma ferramenta de gravação ou transcrição — é uma camada
              de inteligência metodológica.
            </p>
            <List title="Sintomas que a evolu.AI resolve" items={EVOLUAI_SYMPTOMS} />
            <Callout tone="tan">
              Dado de impacto: equipes sem feedback estruturado têm taxa de conversão até 40%
              menor do que equipes com coaching baseado em dados reais de cada interação.
            </Callout>
            <p className="text-sm font-medium">Como Funciona — Fluxo Completo</p>
            <Steps items={EVOLUAI_FLOW} />
            <p className="text-sm font-medium">Score Automático em Tempo Real — Análise 5D</p>
            <Table headers={["Pilar", "O que Avalia"]} rows={EVOLUAI_5D} />
            <List title="Critérios de Sucesso (o que a IA verifica se foi feito)" items={EVOLUAI_SUCCESS_CRITERIA} />
            <List title="Red Flags — Comportamentos que a IA Detecta Automaticamente" items={EVOLUAI_RED_FLAGS} />
            <Callout tone="blue">
              Todos os critérios de sucesso e red flags são 100% customizáveis. O gestor define os
              pesos e regras — a IA avalia segundo os padrões da operação, não de um template
              genérico.
            </Callout>
            <List title="Raio-X — Relatório Executivo Completo" items={EVOLUAI_RAIOX_ITEMS} />
            <List title="Análise de Sentimento" items={EVOLUAI_SENTIMENT} />
            <List title="Dashboard do Gestor" items={EVOLUAI_MANAGER_DASHBOARD} />
            <p className="text-sm font-medium">Integrações e Automações</p>
            <Table headers={["Categoria", "Ferramentas"]} rows={EVOLUAI_INTEGRATIONS} />
            <p className="text-sm font-medium">Diferenciais Declarados</p>
            <Table headers={["Diferencial", "Descrição"]} rows={EVOLUAI_DIFFERENTIALS} />
            <List title="Processo Comercial da evolu.AI" items={EVOLUAI_PROCESS} />
            <Callout tone="green">
              A evolu.AI se integra nativamente com plataformas de chamadas. As gravações geradas
              pela Onvox (PABX em nuvem) alimentam diretamente a evolu.AI para análise. Venda as
              duas juntas como um ecossistema completo de telefonia + inteligência de vendas.
            </Callout>
            <Callout tone="pink" title="Frase de Impacto para Usar na Venda">
              {EVOLUAI_IMPACT_PHRASE}
            </Callout>
          </div>
        </HashSection>

        {/* 4.2 */}
        <HashSection id="m4-sec-2" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            4.2 — API Oficial Meta para WhatsApp — Guia Completo para o Vendedor
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Este guia existe porque a API Oficial do WhatsApp é a base técnica da TakeFlow e a
            primeira dúvida técnica que o cliente levanta. O vendedor precisa dominar esse tema
            para conduzir a conversa com segurança e credibilidade.
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            A API Oficial (WhatsApp Business Platform / Cloud API) é a tecnologia criada pela Meta
            para empresas que precisam usar o WhatsApp de forma profissional e escalável — com
            múltiplos atendentes, automações, chatbots, integrações com sistemas e campanhas em
            massa. É diferente do WhatsApp pessoal (1 dispositivo, sem automação), do WhatsApp
            Business app (até 5 dispositivos, funções limitadas) e de soluções por QR Code não
            oficiais (instáveis, risco de bloqueio permanente).
          </p>
          <Callout tone="blue">
            A TakeFlow atua como Tech Provider oficial da Meta — configura e opera toda a
            estrutura, enquanto a Meta cobra diretamente pelo uso de mensagens na Business Manager
            do cliente.
          </Callout>

          <p className="text-sm font-medium">O Conceito de Conversa — Unidade de Cobrança</p>
          <Callout tone="tan">
            Uma conversa = janela de 24 horas. Dentro dessa janela, empresa e cliente podem trocar
            quantas mensagens quiserem sem custo adicional. Só quando uma nova mensagem é enviada
            fora da janela vigente é que uma nova conversa cobrada começa.
          </Callout>
          <Table headers={["Tipo", "Quem Inicia", "Como Funciona", "Custo"]} rows={META_CONVERSATION_TYPES} />
          <Callout tone="green">
            Dica de ouro: se o cliente chama a empresa primeiro, a conversa é gratuita por 24h.
            Estratégias que incentivam o cliente a dar o primeiro passo (botão no site, link na
            bio, QR code) reduzem drasticamente o custo.
          </Callout>

          <p className="text-sm font-medium">As 4 Categorias de Mensagem e os Custos</p>
          <Table headers={["Categoria", "O que é", "Exemplos", "Custo aproximado (Brasil)"]} rows={META_MESSAGE_CATEGORIES} />
          <Callout tone="tan">
            ATENÇÃO CRÍTICA: A diferença entre Marketing e Utilidade pode ser de até 9x no custo.
            Um lembrete de consulta é Utilidade — não Marketing. Categorizar errado = gastar muito
            mais. As 1.000 primeiras conversas de Serviço por mês são sempre gratuitas para
            qualquer conta.
          </Callout>

          <p className="text-sm font-medium">Estrutura de Custos — Quem Paga o Quê</p>
          <Table headers={["Custo", "O que é", "Para quem paga"]} rows={META_COST_STRUCTURE} />
          <Callout tone="green">
            A TakeFlow não cobra nada sobre as mensagens da Meta. Transparência total — o cliente
            paga a Meta diretamente. Este é um diferencial a ser ressaltado na venda.
          </Callout>

          <p className="text-sm font-medium">Templates — O que São e Como Funcionam</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Quando a empresa quer iniciar uma conversa (ou a janela de 24h fechou), é obrigatório
            usar um modelo de mensagem pré-aprovado pela Meta. Aprovação leva geralmente 24 a 48
            horas (pode chegar a 3 dias em revisões). A Meta pode aprovar, rejeitar ou pausar um
            template. Template fora da janela sem aprovação = mensagem simplesmente não entregue.
          </p>
          <div className="space-y-2">
            {META_TEMPLATE_EXAMPLES.map((t) => (
              <Callout key={t.categoria} tone="blue" title={t.categoria}>
                {t.texto}
              </Callout>
            ))}
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Boas práticas para aprovação rápida: mensagens claras, objetivas, sem links suspeitos,
            sem linguagem promocional em templates de utilidade.
          </p>

          <p className="text-sm font-medium">Limites de Envio — Os Tiers (Níveis)</p>
          <Table headers={["Nível", "Limite diário", "Como chegar lá"]} rows={META_TIERS} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Para subir de nível: enviar pelo menos 50% do limite atual nos últimos 7 dias +
            qualidade alta (verde), com a empresa verificada no Meta Business Manager. O limite se
            aplica apenas a conversas iniciadas pela empresa — quando o cliente manda primeiro, a
            resposta é livre e não consome a cota diária.
          </p>

          <p className="text-sm font-medium">Qualidade da Conta — O Semáforo da Meta</p>
          <Table headers={["Cor", "Status", "O que significa"]} rows={META_QUALITY} />
          <List title="O que derruba a qualidade" items={META_QUALITY_DOWN} />
          <List title="O que mantém a qualidade" items={META_QUALITY_UP} />

          <p className="text-sm font-medium">Opt-In — O que é e Por que é Obrigatório</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Opt-in = o cliente autorizou explicitamente receber mensagens da empresa via WhatsApp.
            A Meta exige opt-in para envio de mensagens iniciadas pela empresa.
          </p>
          <List title="Como coletar opt-in" items={META_OPTIN_METHODS} />

          <p className="text-sm font-medium">Warmup — Aquecimento de Número Novo</p>
          <Steps items={META_WARMUP_STEPS} />
          <Callout tone="tan">
            ATENÇÃO: Números novos que disparam em massa sem warmup têm altíssimo risco de
            bloqueio permanente — e número bloqueado perde histórico, contatos e grupos. Não há
            recurso junto à Meta.
          </Callout>

          <List title="Número para Usar na API — Regras Importantes" items={META_NUMBER_RULES} />
          <List title="Requisitos para Ativar a API Oficial — Checklist" items={META_REQUIREMENTS} />

          <p className="text-sm font-medium">Q&amp;A — Dúvidas Mais Comuns dos Clientes</p>
          <div className="space-y-2">
            {META_QA.map((qa) => (
              <div key={qa.q}>
                <p className="text-sm font-medium">{qa.q}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{qa.a}</p>
              </div>
            ))}
          </div>

          <p className="text-sm font-medium">Comparativo Rápido — Para Usar na Conversa de Vendas</p>
          <Table headers={["", "WhatsApp Pessoal", "WhatsApp Business (app)", "API Oficial (TakeFlow)"]} rows={META_COMPARISON} />

          <p className="text-sm font-medium">Estratégias para Reduzir o Custo Meta — Dica de Valor na Venda</p>
          <Steps items={META_COST_STRATEGIES} />
        </HashSection>

        {/* 4.3 */}
        <HashSection id="m4-sec-3" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            4.3 — Precificação Onvox
          </h2>
          <Callout tone="blue" title="Ferramenta Oficial de Precificação">
            Os vendedores devem usar exclusivamente a Calculadora oficial da Onvox disponível em
            apoio.onvox.com.br/calculadora.html — para montar propostas com preços, DIDs,
            aparelhos, desconto de marketing e resumo de economia. NÃO use como referência a
            proposta comercial existente nos arquivos, pois os preços são configuráveis.
          </Callout>
          <List title="Dados do Cliente" items={ONVOX_CALC_CLIENT_FIELDS} />
          <Table headers={["Plano", "Descrição"]} rows={ONVOX_PLANS} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Enterprise inclui 120 minutos de transcrição com IA gratuitos/mês; Ultimate inclui 240
            minutos. A IA (Recepcionista Virtual e Relatórios Personalizados) está disponível em
            ambos os planos.
          </p>
          <List title="Configuração do Plano na Calculadora" items={ONVOX_CALC_PLAN_CONFIG} />
          <List title="DIDs — Numeração" items={ONVOX_DID_CONFIG} />
          <List title="Aparelhos e Headsets (Marcas Disponíveis)" items={ONVOX_DEVICE_BRANDS} />
          <List title="Resumo Gerado Automaticamente pela Calculadora" items={ONVOX_CALC_SUMMARY} />
          <p className="text-sm font-medium">Adicionais e Avulsos — Precificações</p>
          <Table headers={["Adicional", "Detalhe", "Preço"]} rows={ONVOX_ADDONS} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Prazo de implementação: até 20 dias após aprovação de crédito. Validade da proposta: 7
            dias. Documentos para contratação: RG e CPF do representante legal (digitalizado) e
            Contrato Social (digitalizado).
          </p>
        </HashSection>

        {/* 4.4 */}
        <HashSection id="m4-sec-4" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            4.4 — Precificação TakeFlow
          </h2>
          <Table headers={["Item", "Descrição", "Valor"]} rows={TAKEFLOW_BASE_PRICING} />
          <p className="text-sm font-medium">Pacotes de IA — Atendimento Automatizado (níveis N1 e N2)</p>
          <Table
            headers={["Qtd atend./dia", "Pacote Mensal N1", "Excedente N1", "Pacote Mensal N2", "Excedente N2"]}
            rows={TAKEFLOW_AI_PACKAGES}
          />
          <List title="Regras do Pacote de IA — Crítico para o Vendedor" items={TAKEFLOW_AI_RULES} />
          <p className="text-sm font-medium">Taxa de Implantação</p>
          <Table headers={["Regra", "Detalhe"]} rows={TAKEFLOW_IMPLEMENTATION_FEE} />
          <p className="text-sm font-medium">Condições Contratuais — Comparativo por Tipo de Projeto</p>
          <Table headers={["Condição", "Com IA", "Sem IA"]} rows={TAKEFLOW_CONTRACT_CONDITIONS} />
          <div className="space-y-2">
            <Callout tone="green" title="Projeto com IA">{TAKEFLOW_PITCH_COM_IA}</Callout>
            <Callout tone="green" title="Projeto sem IA">{TAKEFLOW_PITCH_SEM_IA}</Callout>
            <Callout tone="blue" title="Como Apresentar a Implantação">{TAKEFLOW_PITCH_IMPLANTACAO}</Callout>
          </div>
          <p className="text-sm font-medium">Fluxo do Contrato com IA</p>
          <Steps items={TAKEFLOW_CONTRACT_FLOW} />
          <p className="text-sm font-medium">Como Montar uma Proposta TakeFlow — Fórmula Completa</p>
          <Callout tone="tan">{TAKEFLOW_PROPOSAL_FORMULA}</Callout>
          <List title="Exemplo Prático — Clínica com 3 atendentes, 1 número, IA N1 de 100/dia" items={TAKEFLOW_PROPOSAL_EXAMPLE} />
          <p className="text-sm font-medium">Quando Vender IA vs. Quando Não Vender</p>
          <Table headers={["Perfil do Cliente", "Recomendação"]} rows={TAKEFLOW_WHEN_AI} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Calculadora de Custos WhatsApp: web.takeflow.com.br/calculadora — calcula custo real
            por campanha na API Oficial da Meta, estimando quantidade de mensagens, categoria,
            leads estimados e Custo por Lead (CPL), com base na tabela oficial da Meta.
          </p>
        </HashSection>

        {/* 4.5 */}
        <HashSection id="m4-sec-5" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            4.5 — Precificação evolu.AI
          </h2>
          <Table headers={["Plano", "Valor", "Horas de análise/mês", "Principais recursos"]} rows={EVOLUAI_PLANS} />
          <Callout tone="blue">
            Todos os planos incluem transparência financeira total: histórico detalhado de
            consumo de minutos, saldo disponível e previsão de uso — sem surpresas na fatura.
          </Callout>
          <List title="Processo Comercial da evolu.AI" items={EVOLUAI_PROCESS} />
          <List title="Para Quem Indicar a evolu.AI" items={EVOLUAI_FOR_WHOM} />
        </HashSection>

        {/* 4.6 */}
        <HashSection id="m4-sec-6" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            4.6 — Como Identificar Qual Solução se Encaixa em Cada Perfil de Cliente
          </h2>
          <Table headers={["Perfil do Cliente", "Problema Principal", "Solução Recomendada"]} rows={SOLUTION_MAP} />
          <p className="text-sm font-medium">Perguntas de Diagnóstico por Produto</p>
          <List title="Para identificar oportunidade Onvox" items={DIAGNOSTIC_QUESTIONS_ONVOX} />
          <List title="Para identificar oportunidade TakeFlow" items={DIAGNOSTIC_QUESTIONS_TAKEFLOW} />
          <List title="Para identificar oportunidade evolu.AI" items={DIAGNOSTIC_QUESTIONS_EVOLUAI} />
        </HashSection>

        {/* 4.7 */}
        <HashSection id="m4-sec-7" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            4.7 — Como Construir e Apresentar o Business Case com ROI Concreto
          </h2>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Onvox — Business Case</h3>
            <Callout tone="tan">
              Economia mensal = Custo atual do cliente − Mensalidade Onvox · Economia em 12 meses
              = Economia mensal × 12 · Economia em 36 meses = Economia mensal × 36
            </Callout>
            <p className="text-sm font-medium">Exemplo Real (extraído da proposta Conexão Instalações)</p>
            <Table headers={["Item", "Valor"]} rows={ONVOX_ROI_EXAMPLE} />
            <List title="Argumentos de Valor Além da Economia Financeira" items={ONVOX_VALUE_ARGUMENTS} />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">TakeFlow — Business Case</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Situação: clínica com 100 mensagens de agendamento por dia, atendidas manualmente
              por 1 recepcionista.
            </p>
            <Table headers={["Cenário", "Custo mensal", "Observação"]} rows={TAKEFLOW_ROI_SCENARIO} />
            <Callout tone="blue">
              ROI adicional: a IA atende fora do horário comercial, nunca falta, não precisa de
              treinamento recorrente e nunca esquece de fazer o follow-up.
            </Callout>
            <p className="text-sm font-medium">Argumento de Redução de Custo com Mensagens Meta</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Exemplo: empresa que envia 5.000 confirmações de pedido + 3.000 disparos
              promocionais por mês:
            </p>
            <List items={TAKEFLOW_META_SAVINGS_EXAMPLE} />
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">evolu.AI — Business Case</h3>
            <Callout tone="tan">
              Dado de Impacto Central: equipes sem feedback estruturado têm taxa de conversão até
              40% menor do que equipes com coaching baseado em dados reais de cada interação.
            </Callout>
            <p className="text-sm font-medium">
              Cálculo de ROI por Aumento de Conversão — time com 5 closers fazendo 20 ligações/dia
              cada, com taxa de conversão atual de 15%
            </p>
            <List items={EVOLUAI_ROI_CALC} />
            <List title="Outros Argumentos de Valor" items={EVOLUAI_OTHER_ARGUMENTS} />
          </div>
        </HashSection>

        <SectionNav sections={MODULE_4_SECTIONS} />
      </div>
      </PlaybookModuleProvider>
    </>
  );
}
