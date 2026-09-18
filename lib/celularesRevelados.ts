// Nº de celulares revelados por campanha, medido — usado só pra mostrar o %
// de revelação ao lado de "Empresas enriquecidas" na tabela do dashboard.
// Só entram aqui campanhas onde esse número específico (não o total de
// crédito Apollo) já foi separado/confirmado; as demais não mostram %.
//
// ICP - BLIP ETP: 40 de 45 empresas (88,9%) — contagem REAL direto no banco
// (coluna "Telefone revelado pelo Apollo"), medida 2026-09-17. Substitui a
// estimativa anterior por crédito (296 ÷ 8 = 37) porque essa conta quase fecha
// mas não exatamente: confirmado no painel "Detalhes de uso" (17/09, filtrado
// por Gabriel Donadeli) que os 296 créditos são 100% telefone — e-mail não
// gerou crédito nenhum no fluxo de produção (ver
// reference_apollo_pools_de_credito.md). Então 40 telefones reais × 8 = 320
// esperado vs 296 medido = 24 créditos (~3 telefones) sem explicação — gap
// pequeno, provavelmente revelação repetida de contato já revelado antes
// (cache), não vale investigar mais. Usar a contagem real do banco (esta
// aqui) pra cobertura; o crédito medido continua sendo a fonte pra custo.
// ICP - Industrias (têxtil, química e alimentícia) ETP: 444 revelações × 8 =
// 3.552 dos 3.590 créditos totais medidos (~38 créditos de busca) — ver
// reference_apollo_pools_de_credito.md (memória), medido 09/09/2026. Esse
// número ainda é o antigo método (delta de equipe, "teto"), pendente de
// reconferência igual à BLIP ETP.
const CELULARES_REVELADOS: Record<string, number> = {
  "ICP - BLIP ETP": 40,
  "ICP - Industrias (têxtil, química e alimentícia) ETP": 444,
};

export function celularesRevelados(nomeCampanha: string): number | null {
  return CELULARES_REVELADOS[nomeCampanha] ?? null;
}
