// Nº de celulares revelados por campanha, medido — usado só pra mostrar o %
// de revelação ao lado de "Empresas enriquecidas" na tabela do dashboard.
// Só entram aqui campanhas onde esse número específico (não o total de
// crédito Apollo) já foi separado/confirmado; as demais não mostram %.
//
// ICP - BLIP ETP: 296 créditos ÷ 8 = 37 revelações (ver lib/custoRealManual.ts).
// ICP - Industrias (têxtil, química e alimentícia) ETP: 444 revelações × 8 =
// 3.552 dos 3.590 créditos totais medidos (~38 créditos de busca) — ver
// reference_apollo_pools_de_credito.md (memória), medido 09/09/2026.
const CELULARES_REVELADOS: Record<string, number> = {
  "ICP - BLIP ETP": 37,
  "ICP - Industrias (têxtil, química e alimentícia) ETP": 444,
};

export function celularesRevelados(nomeCampanha: string): number | null {
  return CELULARES_REVELADOS[nomeCampanha] ?? null;
}
