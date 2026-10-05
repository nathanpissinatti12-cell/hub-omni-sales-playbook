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
  // Datas abaixo vieram da coluna "Última execução" da lista de Workflows do
  // n8n (todas com toggle desativado, 0 em andamento) — mesma fonte usada
  // pras entradas acima, print conferido em 2026-09-18.
  "ICP - VAREJO PME.": "2026-09-14",
  "ICP - VAREJO": "2026-09-11",
  "ICP - Industrias (têxtil, química e alimentícia) PME": "2026-09-11",
  // "Outbound Onvox - Parceiros1" segue em andamento — não entra aqui.
  "Outbound Onvox - Parceiros": "2026-09-30",
  "ICP - BLIP PME": "2026-10-05",
};

// Mesma normalização de lib/custoRealManual.ts: o nome vem digitado à mão nos
// fluxos do n8n e diverge em maiúsculas/espaçamento.
function normaliza(nome: string): string {
  return nome.toLowerCase().replace(/\s+/g, "");
}

const POR_NOME_NORMALIZADO = new Map(
  Object.entries(ENCERRADA_EM).map(([nome, data]) => [normaliza(nome), data])
);

export function encerradaEm(nomeCampanha: string): string | null {
  return POR_NOME_NORMALIZADO.get(normaliza(nomeCampanha)) ?? null;
}

export function formataDataEncerramento(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
