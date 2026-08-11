import { pool } from "./client";

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
  enviados_meetime: number;
  leads_sem_contato: number;
  taxa_processamento: string;
};

export type SummaryRow = {
  campanhas_ativas: number;
  total_fila: number;
  total_processado: number;
  total_enviados_meetime: number;
};

export async function getCampaignPerformance(): Promise<CampaignPerformanceRow[]> {
  const { rows } = await pool.query(`
    WITH fila_stats AS (
      SELECT
        ${NORMALIZE_NAME("campanha")} AS campanha_norm,
        count(*)::int AS total,
        count(*) FILTER (WHERE status = 'processado')::int AS processado,
        count(*) FILTER (WHERE status = 'pendente')::int AS pendente,
        count(*) FILTER (WHERE status = 'em pausa')::int AS em_pausa,
        count(*) FILTER (WHERE status = 'erro')::int AS erro
      FROM fila_processamento
      GROUP BY campanha_norm
    ),
    empresas_stats AS (
      SELECT
        campanha_id,
        count(*)::int AS empresas_enriquecidas,
        count(*) FILTER (WHERE enviado_meetime)::int AS enviados_meetime
      FROM empresas
      GROUP BY campanha_id
    ),
    leads_stats AS (
      SELECT campanha_id, count(*)::int AS sem_contato
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
      COALESCE(e.enviados_meetime, 0) AS enviados_meetime,
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
  enviados_meetime: number;
  perdidos: number;
};

export type LossReasonRow = {
  motivo: string;
  total: number;
};

export type CnaeRow = {
  cnae: string;
  total: number;
};

export type RegionRow = {
  estado: string;
  total: number;
};

const LOSS_STATUSES = ["sem contato", "sem decisor", "sem pessoas", "sem email valido"];

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
      (SELECT count(*)::int FROM empresas WHERE campanha_id = $1) AS total_empresas,
      (SELECT count(*)::int FROM empresas WHERE campanha_id = $1 AND enviado_meetime) AS enviados_meetime,
      (
        SELECT count(*)::int FROM fila_processamento
        WHERE ${NORMALIZE_NAME("campanha")} = $2 AND lead_status = ANY($3)
      ) AS perdidos
    `,
    [campaignId, normalizeName(campaignName), LOSS_STATUSES]
  );
  return rows[0];
}

export async function getCampaignLossReasons(campaignName: string): Promise<LossReasonRow[]> {
  const { rows } = await pool.query(
    `
    SELECT lead_status AS motivo, count(*)::int AS total
    FROM fila_processamento
    WHERE ${NORMALIZE_NAME("campanha")} = $1 AND lead_status = ANY($2)
    GROUP BY lead_status
    ORDER BY total DESC
    `,
    [normalizeName(campaignName), LOSS_STATUSES]
  );
  return rows;
}

export async function getCampaignCnaeBreakdown(campaignId: string): Promise<CnaeRow[]> {
  const { rows } = await pool.query(
    `
    SELECT COALESCE(NULLIF(cnae_principal, ''), 'Não informado') AS cnae, count(*)::int AS total
    FROM empresas
    WHERE campanha_id = $1
    GROUP BY cnae
    ORDER BY total DESC
    LIMIT 15
    `,
    [campaignId]
  );
  return rows;
}

export async function getCampaignRegionBreakdown(campaignId: string): Promise<RegionRow[]> {
  const { rows } = await pool.query(
    `
    SELECT COALESCE(NULLIF(estado, ''), 'Não informado') AS estado, count(*)::int AS total
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
      (SELECT count(*)::int FROM fila_processamento) AS total_fila,
      (SELECT count(*)::int FROM fila_processamento WHERE status = 'processado') AS total_processado,
      (SELECT count(*) FILTER (WHERE enviado_meetime)::int FROM empresas) AS total_enviados_meetime
  `);
  return rows[0];
}
