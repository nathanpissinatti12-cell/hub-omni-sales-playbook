// Nº de e-mails revelados diretamente pelo Apollo por campanha, medido —
// mesmo padrão de lib/celularesRevelados.ts. E-mail revelado pelo Apollo é
// diferente de e-mail achado pelo Hunter (acertosHunter, em custoCampanha.ts):
// aqui é o Apollo encontrando o e-mail sozinho, sem precisar do fallback.
//
// Testado 2026-09-17: uma chamada ISOLADA `reveal_personal_emails` via MCP
// gastou 1 crédito. Mas no painel "Detalhes de uso" (mesmo dia, filtrado por
// Gabriel Donadeli = conta do n8n) o total de crédito em "E-mail" foi só esse
// 1 — os 41 e-mails revelados pela campanha ICP - BLIP ETP (fluxo em lote)
// não geraram crédito nenhum. Ou seja: e-mail é de graça no fluxo de
// produção; só a chamada MCP isolada cobrou. Ver
// reference_apollo_pools_de_credito.md (memória) pra detalhe completo.
//
// ICP - BLIP ETP: 41 de 45 empresas (91,1%) — contagem REAL direto no banco,
// medida 2026-09-17.
const EMAILS_REVELADOS: Record<string, number> = {
  "ICP - BLIP ETP": 41,
};

export function emailsRevelados(nomeCampanha: string): number | null {
  return EMAILS_REVELADOS[nomeCampanha] ?? null;
}
