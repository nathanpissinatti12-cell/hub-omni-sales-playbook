import { adminPool } from "./adminClient";

export type ValorIndicador = {
  mes: string;
  tipo: "real" | "meta";
  chave: string;
  valor: string | null;
  /** Quem tocou por último neste campo e quando — para o painel mostrar a autoria. */
  editadoPor: string | null;
  editadoEm: string | null;
};

/**
 * Lê todos os lançamentos de uma vez. O painel precisa do histórico completo
 * pra desenhar as curvas de burn-up e a evolução mensal, e o volume é pequeno
 * (algumas centenas de linhas por ciclo), então não vale paginar.
 *
 * O LEFT JOIN traz o nome de quem gravou: é LEFT porque updated_by é nulo nos
 * lançamentos feitos antes de existir vínculo de usuário, e porque um usuário
 * removido não pode fazer o número sumir da tela.
 */
export async function listValores(unidade: string): Promise<ValorIndicador[]> {
  const { rows } = await adminPool.query(
    `SELECT v.mes,
            v.tipo,
            v.chave,
            v.valor,
            u.name AS "editadoPor",
            v.updated_at AS "editadoEm"
       FROM indicadores_valores v
       LEFT JOIN admin_users u ON u.id = v.updated_by
      WHERE v.unidade = $1
      ORDER BY v.mes, v.chave`,
    [unidade]
  );
  return rows;
}

export type UpsertValor = {
  unidade: string;
  mes: string;
  tipo: "real" | "meta";
  chave: string;
  valor: number | null;
  updatedBy: string | null;
};

/**
 * Grava um lançamento e registra a alteração no histórico, numa transação só:
 * ou as duas coisas acontecem, ou nenhuma. Gravar o valor sem o histórico seria
 * pior que não ter histórico nenhum, porque daria a impressão de rastro
 * completo.
 *
 * Valor nulo apaga a linha em vez de guardar NULL — assim "campo limpo" e
 * "campo nunca preenchido" são o mesmo estado, que é como o painel trata os
 * dois casos. O histórico é que lembra que existiu um valor ali.
 */
export async function upsertValor(v: UpsertValor): Promise<void> {
  const cliente = await adminPool.connect();
  try {
    await cliente.query("BEGIN");

    const { rows: antes } = await cliente.query(
      `SELECT valor FROM indicadores_valores
        WHERE unidade = $1 AND mes = $2 AND tipo = $3 AND chave = $4
        FOR UPDATE`,
      [v.unidade, v.mes, v.tipo, v.chave]
    );
    const valorAntigo: string | null = antes[0]?.valor ?? null;

    if (v.valor === null) {
      await cliente.query(
        `DELETE FROM indicadores_valores
          WHERE unidade = $1 AND mes = $2 AND tipo = $3 AND chave = $4`,
        [v.unidade, v.mes, v.tipo, v.chave]
      );
    } else {
      await cliente.query(
        `INSERT INTO indicadores_valores (unidade, mes, tipo, chave, valor, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (unidade, mes, tipo, chave)
         DO UPDATE SET valor = EXCLUDED.valor, updated_by = EXCLUDED.updated_by, updated_at = now()`,
        [v.unidade, v.mes, v.tipo, v.chave, v.valor, v.updatedBy]
      );
    }

    // Digitar o mesmo número de novo não vira linha de histórico: o painel grava
    // a cada pausa na digitação, então sem isto uma correção de dígito deixaria
    // meia dúzia de entradas idênticas.
    const antigoNum = valorAntigo === null ? null : Number(valorAntigo);
    if (antigoNum !== v.valor) {
      await cliente.query(
        `INSERT INTO indicadores_historico
           (unidade, mes, tipo, chave, valor_antigo, valor_novo, acao, alterado_por)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          v.unidade,
          v.mes,
          v.tipo,
          v.chave,
          valorAntigo,
          v.valor,
          v.valor === null ? "apagou" : "gravou",
          v.updatedBy,
        ]
      );
    }

    await cliente.query("COMMIT");
  } catch (e) {
    await cliente.query("ROLLBACK");
    throw e;
  } finally {
    cliente.release();
  }
}

/**
 * Limpa os realizados de um mês, só da unidade informada. As metas (overrides)
 * e as outras unidades são preservadas. Cada valor apagado vira uma linha de
 * histórico — é a única forma de recuperar um clique errado neste botão.
 */
export async function limparRealizados(
  unidade: string,
  mes: string,
  alteradoPor: string | null
): Promise<void> {
  const cliente = await adminPool.connect();
  try {
    await cliente.query("BEGIN");

    const { rows } = await cliente.query(
      `DELETE FROM indicadores_valores
        WHERE unidade = $1 AND mes = $2 AND tipo = 'real'
        RETURNING chave, valor`,
      [unidade, mes]
    );

    for (const r of rows) {
      await cliente.query(
        `INSERT INTO indicadores_historico
           (unidade, mes, tipo, chave, valor_antigo, valor_novo, acao, alterado_por)
         VALUES ($1, $2, 'real', $3, $4, NULL, 'limpou_mes', $5)`,
        [unidade, mes, r.chave, r.valor, alteradoPor]
      );
    }

    await cliente.query("COMMIT");
  } catch (e) {
    await cliente.query("ROLLBACK");
    throw e;
  } finally {
    cliente.release();
  }
}

export type HistoricoItem = {
  mes: string;
  tipo: "real" | "meta";
  chave: string;
  valorAntigo: string | null;
  valorNovo: string | null;
  acao: string;
  alteradoPor: string | null;
  alteradoEm: string;
};

/** Últimas alterações de uma unidade, da mais recente para a mais antiga. */
export async function listHistorico(unidade: string, limite = 50): Promise<HistoricoItem[]> {
  const { rows } = await adminPool.query(
    `SELECT h.mes,
            h.tipo,
            h.chave,
            h.valor_antigo AS "valorAntigo",
            h.valor_novo   AS "valorNovo",
            h.acao,
            u.name         AS "alteradoPor",
            h.alterado_em  AS "alteradoEm"
       FROM indicadores_historico h
       LEFT JOIN admin_users u ON u.id = h.alterado_por
      WHERE h.unidade = $1
      ORDER BY h.alterado_em DESC
      LIMIT $2`,
    [unidade, limite]
  );
  return rows;
}

// ---------------------------------------------------------------------------
// Fechamento de mês
// ---------------------------------------------------------------------------

export type Fechamento = { mes: string; fechadoEm: string; fechadoPor: string | null };

export async function listFechamentos(unidade: string): Promise<Fechamento[]> {
  const { rows } = await adminPool.query(
    `SELECT f.mes, f.fechado_em AS "fechadoEm", u.name AS "fechadoPor"
       FROM indicadores_fechamento f
       LEFT JOIN admin_users u ON u.id = f.fechado_por
      WHERE f.unidade = $1
      ORDER BY f.mes`,
    [unidade]
  );
  return rows;
}

/**
 * Mês fechado não aceita lançamento — nem do Head, que precisa reabrir antes.
 * Consultado a cada gravação: travar só na tela não seguraria uma chamada
 * direta à API, que é justamente por onde o número entraria errado de novo.
 */
export async function mesFechado(unidade: string, mes: string): Promise<boolean> {
  const { rows } = await adminPool.query(
    `SELECT 1 FROM indicadores_fechamento WHERE unidade = $1 AND mes = $2`,
    [unidade, mes]
  );
  return rows.length > 0;
}

export async function fecharMes(unidade: string, mes: string, por: string | null): Promise<void> {
  await adminPool.query(
    `INSERT INTO indicadores_fechamento (unidade, mes, fechado_por)
     VALUES ($1, $2, $3)
     ON CONFLICT (unidade, mes) DO NOTHING`,
    [unidade, mes, por]
  );
}

export async function reabrirMes(unidade: string, mes: string): Promise<void> {
  await adminPool.query(`DELETE FROM indicadores_fechamento WHERE unidade = $1 AND mes = $2`, [
    unidade,
    mes,
  ]);
}

export type Resolucao = {
  mes: string;
  pessoa: string;
  texto: string;
  atualizadoEm: string;
  atualizadoPor: string | null;
};

/**
 * Resoluções de todos os meses da unidade. Mesmo critério de `listValores`: o
 * volume é de uma linha por pessoa por mês, então ler tudo de uma vez custa
 * menos que uma chamada por mês selecionado.
 */
export async function listResolucoes(unidade: string): Promise<Resolucao[]> {
  const { rows } = await adminPool.query(
    `SELECT r.mes,
            r.pessoa,
            r.texto,
            r.atualizado_em AS "atualizadoEm",
            u.name AS "atualizadoPor"
       FROM indicadores_resolucao r
       LEFT JOIN admin_users u ON u.id = r.atualizado_por
      WHERE r.unidade = $1
      ORDER BY r.mes`,
    [unidade]
  );
  return rows;
}

export async function upsertResolucao(input: {
  unidade: string;
  mes: string;
  pessoa: string;
  texto: string;
  por: string | null;
}): Promise<void> {
  await adminPool.query(
    `INSERT INTO indicadores_resolucao (unidade, mes, pessoa, texto, atualizado_por)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (unidade, mes, pessoa)
     DO UPDATE SET texto = EXCLUDED.texto,
                   atualizado_em = now(),
                   atualizado_por = EXCLUDED.atualizado_por`,
    [input.unidade, input.mes, input.pessoa, input.texto, input.por]
  );
}
