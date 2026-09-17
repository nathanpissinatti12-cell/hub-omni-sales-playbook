// Data em que cada campanha foi encerrada (cadência desativada no CRM).
// Não vem do banco — é mantida à mão aqui porque não existe coluna pra isso
// em `campanhas`. Só recebem entrada as campanhas que já têm custo apurado
// no dashboard (ver CAMPANHA_MARCO_CUSTO em db/queries.ts); adicionar uma
// linha nova quando outra campanha com custo for encerrada.
const ENCERRADA_EM: Record<string, string> = {
  "ICP - Industrias (têxtil, química e alimentícia) ETP": "2026-09-09",
  "ICP - Distribuidores Atacadistas Mercados ETP": "2026-09-09",
  "ICP - Hospitais privados": "2026-09-08",
  "ICP - Imobiliaria Rib": "2026-09-04",
  "ICP - BLIP ETP": "2026-09-17",
};

export function encerradaEm(nomeCampanha: string): string | null {
  return ENCERRADA_EM[nomeCampanha] ?? null;
}

export function formataDataEncerramento(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
