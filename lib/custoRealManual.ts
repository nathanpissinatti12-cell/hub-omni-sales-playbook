// Custo real de uma campanha, registrado à mão quando conferido no painel do
// Apollo — mesma ideia de `db/custoCampanhaRealQueries.ts` (`custo_campanha_real`,
// banco admin), mas em código, pra campanhas onde não deu pra gravar no banco
// (precisa do `campanha_id` do baseapollo, que essa sessão não tem acesso).
//
// `creditosApolloReais` aqui é o TOTAL de crédito Apollo gasto no dia — já
// inclui busca/enriquecimento + telefone + qualquer outro recurso cobrado
// (visto em "Uso de créditos → Detalhes de uso", sem filtro de membro/recurso,
// filtrado pela data em que a campanha rodou). Substitui inteiramente a
// estimativa por empresa (CREDITOS_POR_EMPRESA), não soma com ela.
const CUSTO_REAL_MANUAL: Record<
  string,
  { creditosApolloReais: number; deepseekUsdReais: number; conferidoEm: string }
> = {
  // 15/09/2026: "Uso de créditos" sem filtro de membro/recurso, só nesse dia,
  // deu 2.567 créditos no total (1.992 telefone + 575 exportações; busca/
  // enriquecimento deu 0 nesse dia específico). DeepSeek segue estimado
  // (nenhum valor medido informado ainda pra essa campanha).
  "ICP - VAREJO PME.": {
    creditosApolloReais: 2567,
    deepseekUsdReais: 0.000644 * 467, // ainda estimado — sem medição própria
    conferidoEm: "2026-09-15",
  },
};

export function getCustoRealManual(nomeCampanha: string) {
  return CUSTO_REAL_MANUAL[nomeCampanha] ?? null;
}
