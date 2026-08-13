// Total de empresas que a Apollo (o Workflow de origem, fora do nosso banco)
// realmente enrolou pra cada campanha. Esse número não existe em nenhuma
// tabela do baseapollo (o banco só é consultado, nunca gravado por aqui) —
// então é mantido manualmente aqui, conferindo com a tela do Workflow na
// Apollo ("Inscrição"/"Concluído"), toda vez que uma campanha nova subir.
export const CAMPAIGN_ORIGIN_TOTALS: Record<string, number> = {
  "ICP - Logísticas, Transportes e Comex": 525,
};

export function getCampaignOriginTotal(campaignName: string): number | null {
  return CAMPAIGN_ORIGIN_TOTALS[campaignName] ?? null;
}
