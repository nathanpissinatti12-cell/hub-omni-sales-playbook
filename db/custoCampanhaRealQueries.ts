import { adminPool } from "./adminClient";
import type { CampaignPerformanceRow } from "./queries";

export type CustoCampanhaReal = {
  campanha_id: string;
  campanha_nome: string;
  apollo_creditos_reais: string;
  deepseek_usd_reais: string;
  conferido_em: string;
  observacao: string | null;
};

/** Lê todas as campanhas com custo já conferido — usado pra montar a tabela do dashboard. */
export async function listCustosReais(): Promise<CustoCampanhaReal[]> {
  const { rows } = await adminPool.query(
    `SELECT campanha_id, campanha_nome, apollo_creditos_reais, deepseek_usd_reais, conferido_em::text, observacao
     FROM custo_campanha_real`
  );
  return rows;
}

export async function getCustoReal(campanhaId: string): Promise<CustoCampanhaReal | null> {
  const { rows } = await adminPool.query(
    `SELECT campanha_id, campanha_nome, apollo_creditos_reais, deepseek_usd_reais, conferido_em::text, observacao
     FROM custo_campanha_real WHERE campanha_id = $1`,
    [campanhaId]
  );
  return rows[0] ?? null;
}

export type UpsertCustoReal = {
  campanhaId: string;
  campanhaNome: string;
  apolloCreditosReais: number;
  deepseekUsdReais: number;
  conferidoEm: string;
  observacao: string | null;
  updatedBy: string | null;
};

export async function upsertCustoReal(v: UpsertCustoReal): Promise<void> {
  await adminPool.query(
    `INSERT INTO custo_campanha_real
       (campanha_id, campanha_nome, apollo_creditos_reais, deepseek_usd_reais, conferido_em, observacao, updated_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (campanha_id) DO UPDATE SET
       campanha_nome = EXCLUDED.campanha_nome,
       apollo_creditos_reais = EXCLUDED.apollo_creditos_reais,
       deepseek_usd_reais = EXCLUDED.deepseek_usd_reais,
       conferido_em = EXCLUDED.conferido_em,
       observacao = EXCLUDED.observacao,
       updated_by = EXCLUDED.updated_by,
       updated_at = now()`,
    [v.campanhaId, v.campanhaNome, v.apolloCreditosReais, v.deepseekUsdReais, v.conferidoEm, v.observacao, v.updatedBy]
  );
}

export async function deleteCustoReal(campanhaId: string): Promise<void> {
  await adminPool.query(`DELETE FROM custo_campanha_real WHERE campanha_id = $1`, [campanhaId]);
}

/**
 * Cola os custos reais (banco admin) por cima das linhas de performance
 * (banco baseapollo) — os dois bancos são separados, então isso não dá pra
 * fazer com um JOIN em SQL, só juntando os dois resultados aqui.
 */
export function aplicaCustoReal(
  rows: CampaignPerformanceRow[],
  custosReais: CustoCampanhaReal[]
): CampaignPerformanceRow[] {
  const porCampanha = new Map(custosReais.map((c) => [c.campanha_id, c]));
  return rows.map((r) => {
    const real = porCampanha.get(r.id);
    if (!real) return r;
    return {
      ...r,
      custo_real_apollo_creditos: Number(real.apollo_creditos_reais),
      custo_real_deepseek_usd: Number(real.deepseek_usd_reais),
      custo_real_conferido_em: real.conferido_em,
    };
  });
}
