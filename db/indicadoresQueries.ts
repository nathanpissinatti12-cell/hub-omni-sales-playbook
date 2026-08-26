import { adminPool } from "./adminClient";

export type ValorIndicador = {
  mes: string;
  tipo: "real" | "meta";
  chave: string;
  valor: string | null;
};

/**
 * Lê todos os lançamentos de uma vez. O painel precisa do histórico completo
 * pra desenhar as curvas de burn-up e a evolução mensal, e o volume é pequeno
 * (algumas centenas de linhas por ciclo), então não vale paginar.
 */
export async function listValores(): Promise<ValorIndicador[]> {
  const { rows } = await adminPool.query(
    `SELECT mes, tipo, chave, valor FROM indicadores_valores ORDER BY mes, chave`
  );
  return rows;
}

export type UpsertValor = {
  mes: string;
  tipo: "real" | "meta";
  chave: string;
  valor: number | null;
  updatedBy: string | null;
};

/**
 * Grava um lançamento. Valor nulo apaga a linha em vez de guardar NULL — assim
 * "campo limpo" e "campo nunca preenchido" são o mesmo estado, que é como o
 * painel trata os dois casos.
 */
export async function upsertValor(v: UpsertValor): Promise<void> {
  if (v.valor === null) {
    await adminPool.query(`DELETE FROM indicadores_valores WHERE mes = $1 AND tipo = $2 AND chave = $3`, [
      v.mes,
      v.tipo,
      v.chave,
    ]);
    return;
  }

  await adminPool.query(
    `INSERT INTO indicadores_valores (mes, tipo, chave, valor, updated_by)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (mes, tipo, chave)
     DO UPDATE SET valor = EXCLUDED.valor, updated_by = EXCLUDED.updated_by, updated_at = now()`,
    [v.mes, v.tipo, v.chave, v.valor, v.updatedBy]
  );
}

/** Limpa os realizados de um mês. As metas (overrides) são preservadas. */
export async function limparRealizados(mes: string): Promise<void> {
  await adminPool.query(`DELETE FROM indicadores_valores WHERE mes = $1 AND tipo = 'real'`, [mes]);
}
