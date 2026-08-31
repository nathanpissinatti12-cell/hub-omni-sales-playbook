import { pool } from "./client";
import { classifyCnae } from "./cnaeGroups";
import { tierTelefone } from "@/lib/phoneTier";

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
    ORDER BY c.criado_em DESC
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

// A mesma empresa pode ter VÁRIAS linhas na fila: o Apollo insere uma por
// contato encontrado, então um domínio com 2 contatos entra 2x na mesma carga.
// Como cada linha tem seu próprio lead_status, contar `count(DISTINCT dominio)`
// agrupado por status faz a empresa aparecer em duas categorias ao mesmo tempo —
// a cópia que virou lead e a cópia que bateu em "já existe na base" — e a soma
// das categorias estoura o total de empresas submetidas.
//
// Por isso cada empresa recebe UM desfecho: o melhor que ela alcançou. Quem
// subiu pra Meetime conta como "criado meetime" mesmo que a segunda cópia tenha
// parado no meio do caminho.
const DESFECHO_RANK = (paramIndex: number) => `
  CASE
    WHEN lead_status = 'criado meetime'       THEN 1
    WHEN lead_status = 'já existe na meetime' THEN 2
    WHEN lead_status = 'já existe na base'    THEN 3
    WHEN lead_status = ANY($${paramIndex})    THEN 4
    WHEN lead_status = 'sem pessoas'          THEN 5
    WHEN lead_status = 'sem decisor'          THEN 6
    WHEN lead_status = 'sem contato'          THEN 7
    ELSE 9
  END
`;

// Traduz o rank de volta pro lead_status exibido (as chaves de
// LEAD_STATUS_LABELS na tela da campanha).
const DESFECHO_LABEL = `
  CASE rank
    WHEN 1 THEN 'criado meetime'
    WHEN 2 THEN 'já existe na meetime'
    WHEN 3 THEN 'já existe na base'
    WHEN 4 THEN 'sem email valido'
    WHEN 5 THEN 'sem pessoas'
    WHEN 6 THEN 'sem decisor'
    WHEN 7 THEN 'sem contato'
    ELSE 'Não classificado'
  END
`;

// Ranks que representam perda de verdade: a empresa foi processada e não gerou
// lead. "já existe na base" e "já existe na meetime" ficam de fora porque são
// duplicata de campanha anterior, não perda.
const RANK_PERDIDO_MIN = 4;
const RANK_PERDIDO_MAX = 7;

// Uma linha por empresa, com o desfecho já resolvido. Usado pelo resumo e pela
// quebra por status, para os dois falarem o mesmo número.
const DESFECHO_POR_EMPRESA = (paramIndex: number) => `
  SELECT dominio, min(${DESFECHO_RANK(paramIndex)}) AS rank
  FROM fila_processamento
  WHERE ${NORMALIZE_NAME("campanha")} = $1
  GROUP BY dominio
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
    WITH desfecho AS (${DESFECHO_POR_EMPRESA(2)})
    SELECT
      (SELECT count(*)::int FROM desfecho) AS total_empresas,
      (SELECT count(*)::int FROM desfecho WHERE rank = 1) AS criados_meetime,
      (
        SELECT count(*)::int FROM desfecho
        WHERE rank BETWEEN ${RANK_PERDIDO_MIN} AND ${RANK_PERDIDO_MAX}
      ) AS perdidos
    `,
    [normalizeName(campaignName), EMAIL_INVALIDO_VARIANTES]
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
    WITH desfecho AS (${DESFECHO_POR_EMPRESA(2)})
    SELECT ${DESFECHO_LABEL} AS status, count(*)::int AS total
    FROM desfecho
    GROUP BY rank
    ORDER BY total DESC
    `,
    [normalizeName(campaignName), EMAIL_INVALIDO_VARIANTES]
  );
  return rows;
}

export type FitScoreTierRow = {
  tier: "apollo_celular" | "so_fixo" | "outra_fonte_celular" | "sem_dado";
  total: number;
};

// Só dá pra saber, com certeza, se o lead tinha celular do Apollo, só fixo, ou
// celular de outra fonte — a nota exata (6 vs 5, 4 vs 3) depende da origem do
// e-mail, que o fluxo não grava em `empresas`. Ver lib/phoneTier.ts.
export async function getCampaignFitScoreBreakdown(campaignName: string): Promise<FitScoreTierRow[]> {
  const { rows } = (await pool.query(
    `
    WITH desfecho AS (${DESFECHO_POR_EMPRESA(2)})
    SELECT e.telefone_decisor, e.todos_telefones
    FROM desfecho d
    JOIN empresas e ON e.dominio = d.dominio
    WHERE d.rank = 1
    `,
    [normalizeName(campaignName), EMAIL_INVALIDO_VARIANTES]
  )) as { rows: { telefone_decisor: string | null; todos_telefones: string | null }[] };

  const counts: Record<FitScoreTierRow["tier"], number> = {
    apollo_celular: 0,
    so_fixo: 0,
    outra_fonte_celular: 0,
    sem_dado: 0,
  };
  for (const row of rows) {
    counts[tierTelefone(row.telefone_decisor, row.todos_telefones)]++;
  }

  return (Object.keys(counts) as FitScoreTierRow["tier"][])
    .map((tier) => ({ tier, total: counts[tier] }))
    .filter((r) => r.total > 0);
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

export type DailyProcessedRow = {
  dia: string;
  total: number;
};

// Empresas enriquecidas por dia (últimos 14 dias com atividade), pra gráfico de barras.
export async function getGlobalDailyProcessed(): Promise<DailyProcessedRow[]> {
  const { rows } = await pool.query(`
    SELECT to_char(processado_em::date, 'DD/MM') AS dia, count(DISTINCT dominio)::int AS total
    FROM empresas
    WHERE processado_em IS NOT NULL
    GROUP BY processado_em::date
    ORDER BY processado_em::date DESC
    LIMIT 14
  `);
  return rows.reverse();
}

export type ContactStatusRow = {
  completos: number;
  incompletos: number;
};

// "Completos" = empresa enriquecida com decisor identificado (chegou a montar um
// contato). "Incompletos" = caiu em leads_sem_contato (achou a empresa mas não
// achou contato válido).
export async function getGlobalContactStatus(): Promise<ContactStatusRow> {
  const { rows } = await pool.query(`
    SELECT
      (SELECT count(DISTINCT dominio)::int FROM empresas WHERE decisor_nome IS NOT NULL AND decisor_nome != '') AS completos,
      (SELECT count(DISTINCT dominio)::int FROM leads_sem_contato) AS incompletos
  `);
  return rows[0];
}

export type MissingDataRow = {
  label: string;
  total: number;
};

// A partir de leads_sem_contato: o que especificamente faltou pra fechar o lead.
export async function getGlobalMissingDataBreakdown(): Promise<MissingDataRow[]> {
  const { rows } = await pool.query(`
    SELECT
      count(DISTINCT dominio) FILTER (WHERE tem_email = false AND tem_telefone = false)::int AS falta_ambos,
      count(DISTINCT dominio) FILTER (WHERE tem_email = false AND tem_telefone = true)::int AS falta_email,
      count(DISTINCT dominio) FILTER (WHERE tem_email = true AND tem_telefone = false)::int AS falta_telefone
    FROM leads_sem_contato
  `);
  const r = rows[0];
  return [
    { label: "Falta Ambos", total: r.falta_ambos },
    { label: "Falta Email", total: r.falta_email },
    { label: "Falta Telefone", total: r.falta_telefone },
  ];
}

export type StatePercentRow = {
  estado: string;
  total: number;
  percentage: number;
};

// Top estados entre TODAS as empresas enriquecidas (visão global, não por campanha).
export async function getGlobalTopStates(limit = 5): Promise<StatePercentRow[]> {
  const { rows } = await pool.query(`
    SELECT COALESCE(NULLIF(estado, ''), 'Não informado') AS estado, count(DISTINCT dominio)::int AS total
    FROM empresas
    GROUP BY estado
    ORDER BY total DESC
  `);
  const grandTotal = (rows as { total: number }[]).reduce((sum, r) => sum + r.total, 0);
  if (grandTotal === 0) return [];
  const top = rows.slice(0, limit) as { estado: string; total: number }[];
  return top.map((r) => ({ ...r, percentage: Math.round((r.total / grandTotal) * 100) }));
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
