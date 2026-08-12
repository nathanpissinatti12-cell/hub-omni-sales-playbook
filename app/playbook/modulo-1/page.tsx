import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { Table } from "@/components/playbook/Table";
import { Callout } from "@/components/playbook/Callout";
import {
  NAO_DIZER,
  ICPS,
  DECISION_MAP,
  BATTLECARDS,
  NARRATIVE_STEPS,
  RAIO_X,
  CHECKLIST_M1,
  ORIGENS,
} from "@/lib/playbookModule1";

export default function Modulo1Page() {
  return (
    <>
      <PlaybookSidebar activeModuleId={1} />

      <div className="min-w-0 flex-1 space-y-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Playbook de Vendas — Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Módulo 1 — Fundação Estratégica</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Posicionamento · Proposta de Valor por ICP · Diferenciação · Narrativa
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Baseado em: Apresentação Omni Assessoria + PAR OnVox & TakeFlow (Vinteo 2026)
          </p>
        </div>

        {/* Seção 1 */}
        <section id="sec-1" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            Seção 1 — Posicionamento e Mensagem Central de Vendas
          </h2>

          <div className="space-y-3">
            <h3 className="font-medium">1.1 Posicionamento Central</h3>
            <Callout tone="blue" title="Posicionamento central">
              A Omni Assessoria não vende tecnologia. Vende resultado operacional. Somos a
              consultora que entra na empresa, identifica onde a comunicação descentralizada
              está gerando perdas invisíveis, e implementa um ecossistema sob medida — Voz +
              WhatsApp + IA — para que o cliente cresça com previsibilidade, eficiência e
              governança.
            </Callout>
            <Callout tone="green" title="Frase de posicionamento — uso interno do time">
              &quot;Enquanto os concorrentes vendem ramais em nuvem, a Omni entrega inteligência de
              comunicação. A diferença é que o cliente nos contrata uma vez e fica conosco por
              anos — porque a gente resolve o problema real, não só instala um software.&quot;
            </Callout>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">1.2 Pitch de Elevador (30 segundos)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Versão calibrada para o mercado brasileiro. O vendedor deve ser capaz de reproduzir
              sem ler.
            </p>
            <Callout tone="gray" title="Script — Pitch de elevador">
              {`"A Omni há 15 anos ajuda médias e grandes empresas a parar de perder dinheiro com comunicação descentralizada.

A gente faz um raio-X completo da operação, identifica os gargalos que o cliente nem sabe que existem — ligações perdidas, atendimentos sem registro, custo de telefonia que podia ser 20% menor — e implementa um ecossistema de WhatsApp, telefonia em nuvem e inteligência artificial que funciona integrado.

O resultado aparece no faturamento e na eficiência do time. A Neobetel, por exemplo, reduziu 80% da conta da 0800 com a gente.

Posso te mostrar como isso se aplicaria à sua operação?"`}
            </Callout>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">1.3 O que NÃO Dizer — Armadilhas de Posicionamento</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Estas frases enfraquecem o posicionamento e devem ser eliminadas do vocabulário do
              time comercial.
            </p>
            <Table
              headers={["Não dizer", "Por quê é fraco", "Dizer em vez disso"]}
              rows={NAO_DIZER.map((n) => [n.naoDizer, n.porque, n.dizer])}
            />
          </div>
        </section>

        {/* Seção 2 */}
        <section id="sec-2" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            Seção 2 — Proposta de Valor por Perfil de ICP
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Os ICPs abaixo foram mapeados a partir dos melhores clientes da OnVox (por LTV) e da
            TakeFlow, conforme o documento PAR (Vinteo 2026). Cada perfil tem uma dor primária e
            uma mensagem de entrada diferente. O vendedor deve identificar o cluster do prospect
            antes da primeira reunião.
          </p>

          <div className="space-y-6">
            {ICPS.map((icp) => (
              <div
                key={icp.id}
                id={icp.id}
                className="scroll-mt-20 space-y-3 rounded-lg border p-4"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <h3 className="font-medium">{icp.name}</h3>
                <p className="rounded-md px-3 py-2 text-xs font-medium" style={{ background: "var(--border)" }}>
                  Empresas-referência: {icp.referencias}
                </p>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-medium">Dor primária</dt>
                    <dd style={{ color: "var(--text-muted)" }}>{icp.dor}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Gatilho de venda</dt>
                    <dd style={{ color: "var(--text-muted)" }}>{icp.gatilho}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Frase de abertura</dt>
                    <dd className="italic" style={{ color: "var(--text-muted)" }}>{icp.abertura}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Proposta de valor</dt>
                    <dd style={{ color: "var(--text-muted)" }}>{icp.proposta}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Prova social</dt>
                    <dd style={{ color: "var(--text-muted)" }}>{icp.provaSocial}</dd>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <dt className="font-medium">Decisor econômico</dt>
                      <dd style={{ color: "var(--text-muted)" }}>{icp.decisorEconomico}</dd>
                    </div>
                    {icp.compradorTecnico && (
                      <div>
                        <dt className="font-medium">Comprador técnico</dt>
                        <dd style={{ color: "var(--text-muted)" }}>{icp.compradorTecnico}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-medium">Promotor interno</dt>
                      <dd style={{ color: "var(--text-muted)" }}>{icp.promotorInterno}</dd>
                    </div>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div id="sec-2-1" className="scroll-mt-20 space-y-3">
            <h3 className="font-medium">2.1 Mapa de Decisores e Influenciadores por ICP (Framework Miller Heiman)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Regra: nunca trate o prospect como &quot;o decisor único&quot;. Para cada conta-alvo,
              mapear os 4 papéis abaixo no CRM antes da primeira reunião executiva.
            </p>
            <Table
              headers={["Papel", "Quem é (OnVox)", "Quem é (TakeFlow)", "O que importa para ele"]}
              rows={DECISION_MAP.map((d) => [d.papel, d.onvox, d.takeflow, d.importa])}
            />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Atenção: o Promotor (Coach) é o aliado interno mais valioso. Investir no
              relacionamento com ele acelera o ciclo e protege o deal em momentos de resistência
              interna.
            </p>
          </div>
        </section>

        {/* Seção 3 */}
        <section id="sec-3" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            Seção 3 — Como a Omni se Diferencia dos Concorrentes
          </h2>
          <Callout tone="tan" title="Regra de ouro na diferenciação">
            {`Nunca ataque o concorrente diretamente pelo nome em reunião.
Use a estrutura: Problema genérico do mercado → como a Omni resolve de forma diferente → prova social.
Quando o prospect citar um concorrente, pergunte: "O que você não gostou nele?" — e use a resposta como âncora da diferenciação.`}
          </Callout>
          <Table
            headers={["Concorrente", "Ponto fraco deles", "Narrativa de diferenciação da Omni"]}
            rows={BATTLECARDS.map((b) => [b.concorrente, b.fraqueza, b.narrativa])}
          />
        </section>

        {/* Seção 4 */}
        <section id="sec-4" className="scroll-mt-20 space-y-6">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            Seção 4 — Narrativa de Vendas: Do Problema à Solução
          </h2>
          <Callout tone="green" title="Narrativa da quarta revolução industrial — uso em reunião executiva">
            Empresas que ainda dependem de telefone físico, celular sem controle e WhatsApp
            pessoal estão operando com infraestrutura dos anos 2000 numa economia que exige
            velocidade e dados em tempo real. A comunicação descentralizada cria perdas ocultas
            que o gestor não vê na DRE, mas sente no resultado. A Omni prepara empresas para essa
            transição — não como um fornecedor de software, mas como um parceiro estratégico que
            fica ao seu lado.
          </Callout>

          <div id="sec-4-1" className="scroll-mt-20 space-y-3">
            <h3 className="font-medium">4.1 Estrutura da Narrativa em 5 Passos (StoryBrand adaptado)</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Usar nesta ordem em toda reunião de diagnóstico. Adaptar o exemplo conforme o
              cluster do cliente. Não pular etapas.
            </p>
            <Table
              headers={["Passo", "Nome da etapa", "Script (adaptar ao cliente)"]}
              rows={NARRATIVE_STEPS.map((s) => [s.passo, s.nome, s.script])}
            />
          </div>

          <div id="sec-4-2" className="scroll-mt-20 space-y-3">
            <h3 className="font-medium">4.2 O Raio-X Operacional — Roteiro de Diagnóstico</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              O Raio-X não é apenas uma pesquisa de diagnóstico — é a ferramenta comercial
              central da Omni. Deve ser posicionado como etapa de valor entregue ao cliente, não
              como coleta de informações para o vendedor.
            </p>
            <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
              &quot;Antes de qualquer proposta, vou te fazer 6 perguntas que vão nos dar clareza
              sobre onde estão as perdas. Pode ser que ao final você descubra que está tudo bem.
              Ou que você descubra onde está deixando dinheiro na mesa. Nos dois casos, vale o
              tempo.&quot;
            </p>
            <Table
              headers={["Dimensão", "Pergunta-chave para o cliente", "O que a Omni resolve se houver gargalo"]}
              rows={RAIO_X.map((r) => [r.dimensao, r.pergunta, r.resolve])}
            />
          </div>
        </section>

        {/* Seção 5 */}
        <section id="sec-5" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            Seção 5 — Checklist de Implementação — Para o Gestor
          </h2>
          <Callout tone="blue" title="Como usar este checklist">
            Revisar com o time antes de considerar o Módulo 1 implementado. Cada item deve ser
            testado em campo ou em roleplay interno antes de ser marcado como concluído.
            Sugestão: revisar em reunião semanal de pipeline nas primeiras 4 semanas de ativação
            do playbook.
          </Callout>
          <ul className="space-y-2 text-sm">
            {CHECKLIST_M1.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden>☐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Seção 6 */}
        <section id="sec-6" className="scroll-mt-20 space-y-4">
          <h2 className="border-b pb-2 text-xl font-semibold" style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
            Seção 6 — Origem das Práticas e Referências
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Transparência metodológica: o que veio dos próprios materiais da Omni e o que foi
            adaptado de referências externas.
          </p>
          <Table
            headers={["Prática / Conteúdo", "Origem", "Referência"]}
            rows={ORIGENS.map((o) => [o.pratica, o.origem, o.referencia])}
          />
        </section>

        <p className="border-t pt-4 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          Omni Assessoria — Playbook de Vendas — Módulo 1 — Versão 1.0
        </p>
      </div>
    </>
  );
}
