// A série de um indicador mês a mês, para o RMR mostrar evolução ou retrocesso
// ao lado do número do mês fechado.
//
// Um atingimento isolado não diz se a pessoa está melhorando: 64,9% pode ser
// queda de um mês de 90% ou recuperação de um de 40%. A comparação é o que
// transforma o número em tendência.

import type { Indicador, Pessoa } from "./indicadores";
import { fmt, iso, num, resolveMeta, status } from "./indicadoresCalc";

export type PontoSerie = {
  mes: string;
  realizado: string;
  meta: string;
  pct: string;
  atingida: boolean | null;
  /** Variação do ATINGIMENTO contra o mês anterior com dado: "+12,4 p.p." */
  variacao: string;
  /** true = melhorou, false = piorou, null = sem base de comparação. */
  melhorou: boolean | null;
};

function limitesDoMes(mes: string): { ini: string; fim: string } {
  const [ano, m] = mes.split("-").map(Number);
  return { ini: iso(new Date(ano, m - 1, 1)), fim: iso(new Date(ano, m, 0)) };
}

/**
 * Meses do ciclo até o mês do relatório, em ordem. Mês sem lançamento entra
 * assim mesmo: o buraco é informação — mostra que naquele mês não se mediu.
 *
 * A variação compara ATINGIMENTO, não o valor bruto. A meta muda de mês para
 * mês no cronograma, então 58 contra 58 pode ser avanço ou recuo conforme a
 * meta tenha subido. O atingimento já normaliza isso, e já embute a direção do
 * indicador — em "quanto menor melhor" um atingimento maior continua sendo
 * melhor, sem precisar inverter nada aqui.
 */
export function serieDoIndicador(
  pessoa: Pessoa,
  indicador: Indicador,
  meses: string[],
  mesLimite: string,
  reaisPorMes: Record<string, Record<string, string>>,
  metasPorMes: Record<string, Record<string, number | null>>
): PontoSerie[] {
  const chave = `${pessoa.chave}_${indicador.id}`;
  const pontos: PontoSerie[] = [];
  let anterior: number | null = null;

  for (const mes of meses.filter((m) => m <= mesLimite)) {
    const { ini, fim } = limitesDoMes(mes);
    const { base } = resolveMeta(indicador, chave, metasPorMes[mes] ?? {}, ini, fim);
    const real = num((reaisPorMes[mes] ?? {})[chave]);
    const pct = status(real, base, indicador.dir).pct;

    let variacao = "";
    let melhorou: boolean | null = null;
    if (pct !== null && anterior !== null) {
      const d = pct - anterior;
      // Ponto percentual, não "%": a diferença entre dois percentuais não é um
      // percentual — dizer "+12%" aqui seria errado e confundiria com a meta.
      variacao = `${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(1).replace(".", ",")} p.p.`;
      melhorou = d >= 0;
    }
    if (pct !== null) anterior = pct;

    pontos.push({
      mes,
      realizado: real === null ? "" : fmt(real, indicador.fmt),
      meta: base === null ? "" : fmt(base, indicador.fmt),
      pct: pct === null ? "" : `${pct.toFixed(1).replace(".", ",")}%`,
      atingida: pct === null ? null : pct >= 100,
      variacao,
      melhorou,
    });
  }

  // Corta os meses vazios do COMEÇO. O ciclo de 2026 começou a ser medido em
  // agosto, então jan–jul apareciam como sete linhas de travessão antes do
  // primeiro dado — ruído puro, e empurrava a tendência para fora da vista.
  //
  // Buraco no MEIO fica: set/26 sem lançamento entre agosto e outubro é
  // informação, mostra que naquele mês não se mediu.
  const primeiro = pontos.findIndex((p) => p.pct !== "");
  return primeiro <= 0 ? pontos : pontos.slice(primeiro);
}
