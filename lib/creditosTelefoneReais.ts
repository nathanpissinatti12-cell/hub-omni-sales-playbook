// Créditos de telefone (revelação de celular do decisor) REALMENTE gastos por
// campanha, medidos no painel do Apollo (Uso de créditos → Detalhes de uso →
// Recursos: "Números de telefone", filtrado pela data em que a campanha rodou).
//
// Resolvido 2026-09-15: telefone sai do MESMO pool de crédito usado pra
// busca/enriquecimento (lead_credit) — não é um pool separado com preço
// próprio. Por isso `custoCampanha.ts` precifica esse número pelo mesmo
// preço/crédito do Apollo, e soma no total (não fica mais "de fora, sem
// preço confirmado" como antes).
//
// Só entram aqui campanhas onde alguém já conferiu o valor real no painel do
// Apollo — as demais continuam usando a estimativa por % (TAXA_REVELACAO_TELEFONE
// em custoCampanha.ts). Adicionar uma linha nova quando outra campanha for medida.
const TELEFONE_CREDITOS_REAIS: Record<string, number> = {
  "ICP - VAREJO PME.": 1992,
};

export function creditosTelefoneReais(nomeCampanha: string): number | null {
  return TELEFONE_CREDITOS_REAIS[nomeCampanha] ?? null;
}
