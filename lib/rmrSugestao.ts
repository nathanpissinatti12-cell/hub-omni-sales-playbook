// Seções 1 e 2 do RMR montadas a partir do que já está lançado no painel.
//
// Na planilha original esses números eram transcritos à mão do painel para o
// relatório. Transcrição à mão é onde o número começa a divergir de si mesmo:
// o desvio citado na seção 7 deixa de bater com o da seção 1 e a reunião discute
// qual dos dois está certo. Aqui eles nascem do mesmo lugar que a tabela.

import type { Indicador, Pessoa } from "./indicadores";
import { fmt, iso, num, resolveMeta, status } from "./indicadoresCalc";
import type { LinhaPriorizacao, LinhaResultado } from "./rmr";

/**
 * O RMR é de fechamento: compara com a meta CHEIA do mês, não com a
 * proporcional. A proporcional responde "estou no ritmo hoje"; no fim do mês a
 * pergunta é outra — "entreguei o que foi combinado".
 */
function limitesDoMes(mes: string): { ini: string; fim: string } {
  const [ano, m] = mes.split("-").map(Number);
  return { ini: iso(new Date(ano, m - 1, 1)), fim: iso(new Date(ano, m, 0)) };
}

/** "+R$ 14.325" / "-19" — o tamanho do buraco, na unidade do indicador. */
function diferenca(real: number, meta: number, formato: Indicador["fmt"]): string {
  const d = real - meta;
  if (d === 0) return "na meta exata";
  return `${d > 0 ? "+" : "−"}${fmt(Math.abs(d), formato)}`;
}

export type SugestaoRmr = {
  resultado: LinhaResultado[];
  priorizacao: LinhaPriorizacao[];
};

export function sugestaoDoMes(
  pessoa: Pessoa,
  mes: string,
  reais: Record<string, string>,
  metasOverride: Record<string, number | null>
): SugestaoRmr {
  const { ini, fim } = limitesDoMes(mes);
  const resultado: LinhaResultado[] = [];
  const candidatos: { linha: LinhaPriorizacao; pct: number }[] = [];

  for (const ind of pessoa.kpis) {
    const chave = `${pessoa.chave}_${ind.id}`;
    const { base } = resolveMeta(ind, chave, metasOverride, ini, fim);
    const real = num(reais[chave]);

    // Sem meta no mês não há desvio a diagnosticar, e sem lançamento o relatório
    // não deve inventar um zero: a linha entra com o campo em branco, para a
    // pessoa completar ou apagar.
    const pct = status(real, base, ind.dir).pct;

    const comparavel = pct !== null && real !== null && base !== null;
    resultado.push({
      indicador: ind.nome,
      realizado: real === null ? "" : fmt(real, ind.fmt),
      meta: base === null ? "sem meta" : fmt(base, ind.fmt),
      diferenca: comparavel ? diferenca(real, base, ind.fmt) : "",
      pct: comparavel ? `${pct.toFixed(1).replace(".", ",")}%` : "",
      // 100% exato conta como realizada. Abaixo disso, não — inclusive 99,9%:
      // "quase" é conversa da reunião, não veredito da tabela.
      atingida: comparavel ? (pct as number) >= 100 : null,
    });

    if (pct !== null && real !== null && base !== null && pct < 100) {
      candidatos.push({
        pct,
        linha: {
          indicador: ind.nome,
          gap: `${fmt(real, ind.fmt)} vs ${fmt(base, ind.fmt)} (${diferenca(real, base, ind.fmt)})`,
          desvio: `${(100 - pct).toFixed(1).replace(".", ",")}%`,
        },
      });
    }
  }

  // Top 3 pelo maior desvio. É a seção 2 da planilha: o ciclo discute três
  // frentes, não doze — e a ordem define por onde a reunião começa.
  const priorizacao = candidatos
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3)
    .map((c) => c.linha);

  return { resultado, priorizacao };
}
