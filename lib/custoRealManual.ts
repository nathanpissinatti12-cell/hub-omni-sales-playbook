// Custo real de uma campanha, registrado à mão quando conferido no painel do
// Apollo — mesma ideia de `db/custoCampanhaRealQueries.ts` (`custo_campanha_real`,
// banco admin), mas em código, pra campanhas onde não deu pra gravar no banco
// (precisa do `campanha_id` do baseapollo, que essa sessão não tem acesso).
//
// `creditosApolloReais` aqui é o total de crédito Apollo REALMENTE gasto pelo
// fluxo n8n — substitui inteiramente a estimativa por empresa
// (CREDITOS_POR_EMPRESA), não soma com ela. DeepSeek continua estimado
// (empresas consultadas × custo/chamada), calculado dinamicamente por quem
// chama isso, não fica fixo aqui.
//
// IMPORTANTE (aprendido 2026-09-15/16 com a ICP - VAREJO PME.): "Uso de
// créditos" SEM filtro de membro mistura o trabalho manual de outros
// colaboradores (ex.: Julia Lopes usando a extensão do Chrome) com o que o
// fluxo n8n gastou de verdade — dá um total inflado e errado. O jeito certo
// de isolar é filtrar "Membro da equipe" pela conta que a API do n8n usa
// (Gabriel Donadeli) e confirmar na tabela/feed que a origem de cada linha é
// "API Test" / usuário "Você" (não "Extensão"). Só esse total é atribuível
// à campanha.
const CUSTO_REAL_MANUAL: Record<
  string,
  { creditosApolloReais: number; conferidoEm: string; deepseekUsdReais?: number }
> = {
  // 15/09/2026: filtrado em "Gabriel Donadeli", sem filtro de recurso, deu
  // 1.992 créditos no total — 100% em "Números de telefone" (249 revelações
  // × 8), confirmado linha a linha no feed como origem "API Test"/"Você".
  // Nenhum crédito de busca/enriquecimento nesse dia — a estimativa antiga
  // de 1.882 créditos pra essa parte nunca aconteceu de fato.
  "ICP - VAREJO PME.": {
    creditosApolloReais: 1992,
    conferidoEm: "2026-09-15",
  },
  // 17/09/2026: mesma checagem (Gabriel Donadeli, sem filtro de recurso) —
  // 296 créditos no total, confirmado 100% "Números de telefone" no painel
  // "Detalhes de uso" (0 crédito em "E-mail" nesse dia pro fluxo de
  // produção — revelar e-mail em lote não cobra, só uma chamada MCP isolada
  // testada depois cobrou 1cr). DeepSeek também
  // medido direto no painel de billing (Today, API Key: All): US$0,18 em 45
  // chamadas. Os números se cruzam quase perfeitamente: 45 chamadas
  // DeepSeek = 45 empresas consultadas (1 chamada cada); a contagem real de
  // telefones revelados no banco é 40 de 45 (88,9%, ver
  // lib/celularesRevelados.ts) — 296 ÷ 8 = 37 credita menos que os 40 reais,
  // gap de 24 créditos (~3 telefones) ainda sem explicação, provavelmente
  // revelação repetida de contato já revelado antes. Gemini não foi medido à
  // parte aqui — segue a taxa estimada (45 × R$0,007 ≈ R$0,32), calculada
  // dinamicamente por quem chama isso (empresasConsultadas real do banco).
  //
  // 05/10/2026: os 296 foram contestados (a sessão de N8N/Apollo falou em ~370)
  // e reconferidos contra o banco. Os 296 se sustentam:
  //   - a campanha rodou INTEIRA em 17/09, das 14:25 às 17:33 (processando_em),
  //     então o filtro "17/09 a 17/09" pegou a janela completa;
  //   - nenhuma outra campanha rodou nesse dia pela conta do n8n, então não há
  //     contaminação: os 296 são todos dela;
  //   - 296 ÷ 8 = 37 revelações exatas, sem resto.
  // O banco tem 40 linhas com telefone_decisor, mas só 39 números distintos, e
  // desses apenas 35 têm formato de celular (13+ dígitos). Telefone preenchido
  // não é telefone pago — fixo e telefone de empresa entram de graça. Por isso
  // 40 preenchidos convivem com 37 revelações cobradas.
  // Os ~370 não se reproduzem pelo painel filtrado por membro; batem com o
  // delta de saldo da equipe inteira, que é teto e inclui uso manual de outros.
  "ICP - BLIP ETP": {
    creditosApolloReais: 296,
    conferidoEm: "2026-09-17",
    deepseekUsdReais: 0.18,
  },
  // 18/09/2026: 729 créditos no total, 129 empresas enriquecidas. Diferente
  // das duas medições acima, aqui o crédito de match/busca NÃO foi de graça:
  // 729 = 129×1 (match) + 75×8 (telefone) — bate exato, sem resto. Taxa de
  // revelação de telefone = 75/129 = 58,1%, próxima dos 55,9% já calibrados.
  // DeepSeek não medido nesse dia — segue a estimativa padrão
  // (empresasConsultadas × custo/chamada).
  "ICP - Distribuidores Atacadistas Mercados ETP": {
    creditosApolloReais: 729,
    conferidoEm: "2026-09-18",
  },
  // 05/10/2026: 1.408 créditos para 295 na fila / 260 enriquecidas / 225 leads
  // criados no Ontime — 5,4 créditos por empresa enriquecida e 6,3 por lead.
  // O painel mostra os 1.408 inteiros em "Números de telefone": 1.408 ÷ 8 = 176
  // revelações exatas, sem sobra, ou seja nenhum crédito de match/busca — mesmo
  // padrão da VAREJO PME. e da BLIP ETP. DeepSeek não medido nesse dia; segue a
  // estimativa padrão.
  "ICP - BLIP PME": {
    creditosApolloReais: 1408,
    conferidoEm: "2026-10-05",
  },
};

// O nome da campanha é digitado à mão em cada fluxo do n8n e volta com
// maiúsculas/espaçamento diferentes do que está escrito aqui ("ICP - Blip PME"
// vs "ICP - BLIP PME"). Com busca exata, divergir uma letra fazia o custo
// medido sumir do painel sem erro nenhum. A normalização é a mesma que
// db/queries.ts já usa pra casar fila_processamento com campanhas.
function normaliza(nome: string): string {
  return nome.toLowerCase().replace(/\s+/g, "");
}

const POR_NOME_NORMALIZADO = new Map(
  Object.entries(CUSTO_REAL_MANUAL).map(([nome, dados]) => [normaliza(nome), dados])
);

export function getCustoRealManual(nomeCampanha: string) {
  return POR_NOME_NORMALIZADO.get(normaliza(nomeCampanha)) ?? null;
}
