import { pool } from "./client";
import { classifyCnae } from "./cnaeGroups";

// fila_processamento.campanha é digitado à mão e diverge de campanhas.nome
// em maiúsculas/espaçamento (ex.: "ICPs -imobiliaria" vs "ICPS - imobiliaria"),
// então a comparação usa nome normalizado (minúsculas, sem espaços) nos dois lados.
const NORMALIZE_NAME = (col: string) => `lower(regexp_replace(${col}, '\\s+', '', 'g'))`;
const normalizeName = (s: string) => s.toLowerCase().replace(/\s+/g, "");

export type CampaignPerformanceRow = {
  id: string;
  nome: string;
  status: string;
  total_fila: number;
  processado: number;
  pendente: number;
  em_pausa: number;
  erro: number;
  empresas_enriquecidas: number;
  criados_meetime: number;
  leads_sem_contato: number;
  taxa_processamento: string;
};

export type SummaryRow = {
  campanhas_ativas: number;
  total_fila: number;
  total_processado: number;
  total_criados_meetime: number;
  total_empresas_enriquecidas: number;
};

export async function getCampaignPerformance(): Promise<CampaignPerformanceRow[]> {
  const { rows } = await pool.query(`
    WITH fila_stats AS (
      SELECT
        ${NORMALIZE_NAME("campanha")} AS campanha_norm,
        count(DISTINCT dominio)::int AS total,
        count(DISTINCT dominio) FILTER (WHERE status = 'processado')::int AS processado,
        count(DISTINCT dominio) FILTER (WHERE status = 'pendente')::int AS pendente,
        count(DISTINCT dominio) FILTER (WHERE status = 'em pausa')::int AS em_pausa,
        count(DISTINCT dominio) FILTER (WHERE status = 'erro')::int AS erro,
        count(DISTINCT dominio) FILTER (WHERE lead_status = 'criado meetime')::int AS criados_meetime
      FROM fila_processamento
      GROUP BY campanha_norm
    ),
    empresas_stats AS (
      SELECT
        campanha_id,
        count(DISTINCT dominio)::int AS empresas_enriquecidas
      FROM empresas
      GROUP BY campanha_id
    ),
    leads_stats AS (
      SELECT campanha_id, count(DISTINCT dominio)::int AS sem_contato
      FROM leads_sem_contato
      GROUP BY campanha_id
    )
    SELECT
      c.id,
      c.nome,
      c.status,
      COALESCE(f.total, 0) AS total_fila,
      COALESCE(f.processado, 0) AS processado,
      COALESCE(f.pendente, 0) AS pendente,
      COALESCE(f.em_pausa, 0) AS em_pausa,
      COALESCE(f.erro, 0) AS erro,
      COALESCE(e.empresas_enriquecidas, 0) AS empresas_enriquecidas,
      COALESCE(f.criados_meetime, 0) AS criados_meetime,
      COALESCE(l.sem_contato, 0) AS leads_sem_contato,
      CASE
        WHEN COALESCE(f.total, 0) > 0
          THEN ROUND(100.0 * COALESCE(f.processado, 0) / f.total, 1)
        ELSE 0
      END AS taxa_processamento
    FROM campanhas c
    LEFT JOIN fila_stats f ON f.campanha_norm = ${NORMALIZE_NAME("c.nome")}
    LEFT JOIN empresas_stats e ON e.campanha_id = c.id
    LEFT JOIN leads_stats l ON l.campanha_id = c.id
    ORDER BY total_fila DESC, c.criado_em DESC
  `);
  return rows;
}

export type CampaignRow = {
  id: string;
  nome: string;
  status: string;
};

export type CampaignSummaryRow = {
  total_empresas: number;
  criados_meetime: number;
  perdidos: number;
};

export type RegionRow = {
  estado: string;
  total: number;
};

// "Adicionado na Planilha" / "Adionano na Planilha" (typo de uma versão antiga do
// fluxo n8n) são o mesmo resultado que "sem email valido": nenhuma fonte achou um
// e-mail válido pro decisor, então o lead foi pra planilha de acompanhamento manual.
// O fluxo já foi corrigido para gravar só "sem email valido" daqui pra frente, mas
// registros antigos ainda têm os dois nomes antigos — unificamos aqui na exibição.
const EMAIL_INVALIDO_VARIANTES = ["sem email valido", "Adicionado na Planilha", "Adionano na Planilha"];

const LOSS_STATUSES = ["sem contato", "sem decisor", "sem pessoas", ...EMAIL_INVALIDO_VARIANTES];

// Monta a expressão SQL que normaliza lead_status, usando o parâmetro na posição
// `paramIndex` (1-based) para a lista de variantes de "sem email valido".
const LEAD_STATUS_NORMALIZADO = (paramIndex: number) => `
  CASE
    WHEN lead_status = ANY($${paramIndex}) THEN 'sem email valido'
    ELSE COALESCE(lead_status, 'Não classificado')
  END
`;

export async function getCampaignById(id: string): Promise<CampaignRow | null> {
  const { rows } = await pool.query(
    `SELECT id, nome, status FROM campanhas WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function getCampaignSummary(
  campaignId: string,
  campaignName: string
): Promise<CampaignSummaryRow> {
  const { rows } = await pool.query(
    `
    SELECT
      (SELECT count(DISTINCT dominio)::int FROM empresas WHERE campanha_id = $1) AS total_empresas,
      (
        SELECT count(DISTINCT dominio)::int FROM fila_processamento
        WHERE ${NORMALIZE_NAME("campanha")} = $2 AND lead_status = 'criado meetime'
      ) AS criados_meetime,
      (
        SELECT count(DISTINCT dominio)::int FROM fila_processamento
        WHERE ${NORMALIZE_NAME("campanha")} = $2 AND lead_status = ANY($3)
      ) AS perdidos
    `,
    [campaignId, normalizeName(campaignName), LOSS_STATUSES]
  );
  return rows[0];
}

export type QueueStatusRow = {
  status: string;
  total: number;
};

export async function getCampaignQueueStatusBreakdown(campaignName: string): Promise<QueueStatusRow[]> {
  const { rows } = await pool.query(
    `
    SELECT status, count(DISTINCT dominio)::int AS total
    FROM fila_processamento
    WHERE ${NORMALIZE_NAME("campanha")} = $1
    GROUP BY status
    ORDER BY total DESC
    `,
    [normalizeName(campaignName)]
  );
  return rows;
}

export async function getCampaignLeadStatusBreakdown(campaignName: string): Promise<QueueStatusRow[]> {
  const { rows } = await pool.query(
    `
    SELECT ${LEAD_STATUS_NORMALIZADO(2)} AS status, count(DISTINCT dominio)::int AS total
    FROM fila_processamento
    WHERE ${NORMALIZE_NAME("campanha")} = $1
    GROUP BY ${LEAD_STATUS_NORMALIZADO(2)}
    ORDER BY total DESC
    `,
    [normalizeName(campaignName), EMAIL_INVALIDO_VARIANTES]
  );
  return rows;
}

export type CampaignOriginBreakdownRow = {
  sem_dominio: number;
  criados_meetime: number;
  sem_email: number;
};

// "sem_dominio" conta LINHA BRUTA, não domínio distinto: essas linhas
// compartilham o mesmo texto quebrado ('{{account.domain}}', campo de
// mesclagem da Apollo que não resolveu), então cada linha representa uma
// empresa de origem diferente mesmo aparecendo como "1 domínio só" no banco.
export async function getCampaignOriginBreakdown(campaignName: string): Promise<CampaignOriginBreakdownRow> {
  const { rows } = await pool.query(
    `
    SELECT
      count(*) FILTER (WHERE dominio = '{{account.domain}}')::int AS sem_dominio,
      count(DISTINCT dominio) FILTER (WHERE lead_status IN ('criado meetime', 'já existe na meetime'))::int AS criados_meetime,
      count(DISTINCT dominio) FILTER (WHERE lead_status = ANY($2))::int AS sem_email
    FROM fila_processamento
    WHERE ${NORMALIZE_NAME("campanha")} = $1
    `,
    [normalizeName(campaignName), EMAIL_INVALIDO_VARIANTES]
  );
  return rows[0];
}

export type CnaeGroupRow = {
  group: string;
  percentage: number;
};

// Retorna os grupos de setor (CNAE agrupado por atividade) com o percentual
// de empresas submetidas que cada grupo representa, do maior para o menor.
export async function getCampaignCnaeGroups(campaignId: string): Promise<CnaeGroupRow[]> {
  const { rows } = await pool.query(
    `
    SELECT cnae_principal, count(DISTINCT dominio)::int AS total
    FROM empresas
    WHERE campanha_id = $1
    GROUP BY cnae_principal
    `,
    [campaignId]
  );

  const totals = new Map<string, number>();
  let grandTotal = 0;
  for (const row of rows as { cnae_principal: string | null; total: number }[]) {
    const group = classifyCnae(row.cnae_principal);
    totals.set(group, (totals.get(group) ?? 0) + row.total);
    grandTotal += row.total;
  }
  if (grandTotal === 0) return [];

  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([group, total]) => ({
      group,
      percentage: Math.round((total / grandTotal) * 100),
    }));
}

export async function getCampaignRegionBreakdown(campaignId: string): Promise<RegionRow[]> {
  const { rows } = await pool.query(
    `
    SELECT COALESCE(NULLIF(estado, ''), 'Não informado') AS estado, count(DISTINCT dominio)::int AS total
    FROM empresas
    WHERE campanha_id = $1
    GROUP BY estado
    ORDER BY total DESC
    `,
    [campaignId]
  );
  return rows;
}

export async function getSummary(): Promise<SummaryRow> {
  const { rows } = await pool.query(`
    SELECT
      (SELECT count(*)::int FROM campanhas WHERE status = 'ativa') AS campanhas_ativas,
      (SELECT count(DISTINCT dominio)::int FROM fila_processamento) AS total_fila,
      (SELECT count(DISTINCT dominio)::int FROM fila_processamento WHERE status = 'processado') AS total_processado,
      (SELECT count(DISTINCT dominio)::int FROM fila_processamento WHERE lead_status = 'criado meetime') AS total_criados_meetime,
      (SELECT count(DISTINCT dominio)::int FROM empresas) AS total_empresas_enriquecidas
  `);
  return rows[0];
}
