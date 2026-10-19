import { adminPool } from "./adminClient";

export type RmrSalvo = {
  mes: string;
  pessoa: string;
  conteudo: unknown;
  atualizadoEm: string;
  atualizadoPor: string | null;
};

/**
 * Lê os relatórios de uma unidade. Sem filtro de mês de propósito: a tela
 * precisa saber quais meses já têm relatório para marcar o seletor, e o volume é
 * de uma linha por pessoa por mês — algumas dezenas por ciclo.
 *
 * `pessoas` restringe a quem o usuário pode ver. Vem da permissão, nunca do
 * cliente: é o que impede um colaborador de pedir o diagnóstico do colega, que
 * aqui dentro inclui pedido de suporte e avaliação de capacidade.
 */
export async function listRmr(unidade: string, pessoas: string[] | null): Promise<RmrSalvo[]> {
  if (pessoas !== null && pessoas.length === 0) return [];

  const { rows } = await adminPool.query(
    `SELECT r.mes,
            r.pessoa,
            r.conteudo,
            r.atualizado_em AS "atualizadoEm",
            u.name          AS "atualizadoPor"
       FROM indicadores_rmr r
       LEFT JOIN admin_users u ON u.id = r.atualizado_por
      WHERE r.unidade = $1
        AND ($2::text[] IS NULL OR r.pessoa = ANY($2))
      ORDER BY r.mes DESC, r.pessoa`,
    [unidade, pessoas]
  );
  return rows as RmrSalvo[];
}

export async function getRmr(
  unidade: string,
  mes: string,
  pessoa: string
): Promise<RmrSalvo | null> {
  const { rows } = await adminPool.query(
    `SELECT r.mes,
            r.pessoa,
            r.conteudo,
            r.atualizado_em AS "atualizadoEm",
            u.name          AS "atualizadoPor"
       FROM indicadores_rmr r
       LEFT JOIN admin_users u ON u.id = r.atualizado_por
      WHERE r.unidade = $1 AND r.mes = $2 AND r.pessoa = $3`,
    [unidade, mes, pessoa]
  );
  return (rows[0] as RmrSalvo | undefined) ?? null;
}

/**
 * Grava o documento inteiro. É sempre substituição, não merge: a tela manda o
 * estado completo do formulário, e mesclar campo a campo faria duas abas
 * abertas se sobrescreverem parcialmente, gerando um relatório que ninguém
 * escreveu.
 */
export async function upsertRmr(
  unidade: string,
  mes: string,
  pessoa: string,
  conteudo: unknown,
  usuarioId: string | null
): Promise<void> {
  await adminPool.query(
    `INSERT INTO indicadores_rmr (unidade, mes, pessoa, conteudo, atualizado_por)
          VALUES ($1, $2, $3, $4::jsonb, $5)
     ON CONFLICT (unidade, mes, pessoa)
     DO UPDATE SET conteudo = EXCLUDED.conteudo,
                   atualizado_por = EXCLUDED.atualizado_por,
                   atualizado_em = now()`,
    [unidade, mes, pessoa, JSON.stringify(conteudo), usuarioId]
  );
}
