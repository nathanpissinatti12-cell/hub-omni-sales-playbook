// Custo real de uma campanha, registrado à mão quando conferido no painel do
// Apollo — mesma ideia de `db/custoCampanhaRealQueries.ts` (`custo_campanha_real`,
// banco admin), mas em código, pra campanhas onde não deu pra gravar no banco
// (precisa do `campanha_id` do baseapollo, que essa sessão não tem acesso).
//
// `creditosApolloReais` aqui é o total de crédito Apollo REALMENTE gasto pelo
// fluxo n8n — substitui inteiramente a estimativa por empresa
// (CREDITOS_POR_EMPRESA), não soma com ela.
//
// IMPORTANTE (aprendido 2026-09-15/16 com a ICP - VAREJO PME.): "Uso de
// créditos" SEM filtro de membro mistura o trabalho manual de outros
// colaboradores (ex.: Julia Lopes usando a extensão do Chrome) com o que o
// fluxo n8n gastou de verdade — dá um total inflado e errado. O jeito certo
// de isolar é filtrar "Membro da equipe" pela conta que a API do n8n usa
// (aqui: Gabriel Donadeli) e confirmar na tabela/feed que a origem de cada
// linha é "API Test" / usuário "Você" (não "Extensão"). Só esse total é
// atribuível à campanha.
const CUSTO_REAL_MANUAL: Record<
  string,
  { creditosApolloReais: number; deepseekUsdReais: number; conferidoEm: string }
> = {
  // 15/09/2026: "Uso de créditos" filtrado em "Gabriel Donadeli" (conta do
  // n8n), sem filtro de recurso, deu 1.992 créditos no total — 100% em
  // "Números de telefone" (249 revelações × 8), confirmado linha a linha no
  // feed de atividades como origem "API Test"/"Você". Nenhum crédito de
  // busca/enriquecimento nesse dia — a estimativa antiga de 1.882 créditos
  // pra essa parte nunca aconteceu de fato. DeepSeek segue estimado (nenhum
  // valor medido informado ainda pra essa campanha).
  "ICP - VAREJO PME.": {
    creditosApolloReais: 1992,
    deepseekUsdReais: 0.000644 * 467, // ainda estimado — sem medição própria
    conferidoEm: "2026-09-15",
  },
};

export function getCustoRealManual(nomeCampanha: string) {
  return CUSTO_REAL_MANUAL[nomeCampanha] ?? null;
}
