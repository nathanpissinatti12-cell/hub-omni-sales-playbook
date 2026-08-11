import { pool } from "./client";

export type FunnelStageRow = {
  id: number;
  name: string;
  position: number;
  deal_count: number;
  avg_days_in_stage: string | null;
};

export type RevenueMonthRow = {
  month: string;
  revenue_cents: string;
  target_cents: string;
};

export type RepPerformanceRow = {
  id: number;
  name: string;
  deals_won: number;
  revenue_cents: string;
  avg_ticket_cents: string;
};

export async function getFunnel(): Promise<FunnelStageRow[]> {
  const { rows } = await pool.query(`
    SELECT
      ps.id,
      ps.name,
      ps.position,
      COUNT(DISTINCT d.id)::int AS deal_count,
      ROUND(AVG(
        EXTRACT(EPOCH FROM (COALESCE(h.exited_at, now()) - h.entered_at)) / 86400
      )::numeric, 1) AS avg_days_in_stage
    FROM pipeline_stages ps
    LEFT JOIN deals d ON d.stage_id = ps.id
    LEFT JOIN deal_stage_history h ON h.stage_id = ps.id
    GROUP BY ps.id, ps.name, ps.position
    ORDER BY ps.position
  `);
  return rows;
}

export async function getRevenueByMonth(): Promise<RevenueMonthRow[]> {
  const { rows } = await pool.query(`
    WITH months AS (
      SELECT date_trunc('month', now()) - (n || ' months')::interval AS month
      FROM generate_series(0, 5) AS n
    ),
    won AS (
      SELECT date_trunc('month', closed_at) AS month, SUM(value_cents) AS revenue_cents
      FROM deals
      WHERE status = 'won' AND closed_at IS NOT NULL
      GROUP BY 1
    ),
    target AS (
      SELECT date_trunc('month', month) AS month, SUM(revenue_target_cents) AS target_cents
      FROM goals
      GROUP BY 1
    )
    SELECT
      to_char(m.month, 'YYYY-MM') AS month,
      COALESCE(w.revenue_cents, 0)::bigint AS revenue_cents,
      COALESCE(t.target_cents, 0)::bigint AS target_cents
    FROM months m
    LEFT JOIN won w ON w.month = m.month
    LEFT JOIN target t ON t.month = m.month
    ORDER BY m.month
  `);
  return rows;
}

export async function getRepPerformance(): Promise<RepPerformanceRow[]> {
  const { rows } = await pool.query(`
    SELECT
      r.id,
      r.name,
      COUNT(d.id) FILTER (WHERE d.status = 'won')::int AS deals_won,
      COALESCE(SUM(d.value_cents) FILTER (WHERE d.status = 'won'), 0)::bigint AS revenue_cents,
      COALESCE(
        ROUND(AVG(d.value_cents) FILTER (WHERE d.status = 'won')::numeric, 0),
        0
      )::bigint AS avg_ticket_cents
    FROM reps r
    LEFT JOIN deals d ON d.rep_id = r.id
    GROUP BY r.id, r.name
    ORDER BY revenue_cents DESC
  `);
  return rows;
}
