// Quantas seções rastreáveis (HashSection) cada módulo tem de verdade —
// não é o mesmo número de itens do menu de navegação em todo módulo (alguns
// quebram um tópico do menu em várias HashSection internas). Contado direto
// nos arquivos de cada módulo; atualize aqui se um módulo ganhar/perder seção.
export const MODULE_SECTION_COUNTS: Record<number, number> = {
  1: 6,
  2: 14,
  3: 10,
  4: 7,
  5: 8,
  6: 3,
};
