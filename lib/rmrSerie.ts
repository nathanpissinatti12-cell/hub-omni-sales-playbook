// A série do REALIZADO de um indicador, mês a mês, para o RMR mostrar evolução
// ou retrocesso ao lado do número do mês fechado.
//
// Compara realizado com realizado, sem a meta no meio. Uma primeira versão
// comparava atingimento, e distorcia: se a meta sobe de 7.765 para 9.254 e o
// realizado fica igual, o atingimento cai sem ninguém ter piorado — e sobe se a
// meta cair. Como as metas de MRR crescem mês a mês no cronograma, a
// comparação dizia mais sobre a régua do que sobre o trabalho.
//
// Entregar menos que o combinado é outra pergunta, e a tabela do mês já a
// responde. Aqui a pergunta é só: está produzindo mais ou menos do que antes?

import type { Indicador, Pessoa } from "./indicadores";
import { fmt, num } from "./indicadoresCalc";

export type PontoSerie = {
  mes: string;
  /** Vazio quando não houve lançamento naquele mês. */
  realizado: string;
  /** Variação contra o mês anterior COM lançamento: "+121", "−R$ 500", "+5 p.p." */
  variacao: string;
  /**
   * Para onde o NÚMERO foi: true subiu, false caiu, null sem comparação ou
   * igual. Separado do julgamento de propósito — no No-show o número subir é
   * piorar, e misturar as duas coisas numa seta só produzia "↓ +8 p.p.", que é
   * exato e ilegível.
   */
  subiu: boolean | null;
  /**
   * true = melhorou, false = piorou, null = sem base ou valor repetido.
   *
   * Aqui a direção do indicador importa de verdade: sem a meta normalizando,
   * cair é bom em No-show e ruim em Leads iniciados. É o único lugar da série
   * que precisa saber disso.
   */
  melhorou: boolean | null;
};

/**
 * Diferença entre dois valores, na unidade do indicador.
 *
 * Indicador que JÁ É percentual (No-show, On-time) vira ponto percentual: a
 * diferença entre 20% e 25% são 5 p.p., não 5%. Chamar de "%" aqui faria o
 * leitor pensar em variação relativa, que é outra conta.
 */
function diferenca(atual: number, anterior: number, formato: Indicador["fmt"]): string {
  const d = atual - anterior;
  const sinal = d >= 0 ? "+" : "−";
  const abs = Math.abs(d);
  if (formato === "pct") return `${sinal}${abs.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} p.p.`;
  return `${sinal}${fmt(abs, formato)}`;
}

/**
 * Meses do ciclo até o mês do relatório. Mês sem lançamento entra como buraco —
 * mostra que naquele mês não se mediu —, mas os vazios do COMEÇO são cortados:
 * o ciclo de 2026 só passou a ser medido em agosto, e jan–jul viriam como sete
 * linhas de travessão antes do primeiro dado.
 *
 * A comparação pula buraco: outubro se compara com agosto se setembro estiver
 * vazio, em vez de ficar sem variação.
 */
export function serieDoIndicador(
  pessoa: Pessoa,
  indicador: Indicador,
  meses: string[],
  mesLimite: string,
  reaisPorMes: Record<string, Record<string, string>>
): PontoSerie[] {
  const chave = `${pessoa.chave}_${indicador.id}`;
  const pontos: PontoSerie[] = [];
  let anterior: number | null = null;

  for (const mes of meses.filter((m) => m <= mesLimite)) {
    const real = num((reaisPorMes[mes] ?? {})[chave]);

    let variacao = "";
    let melhorou: boolean | null = null;
    let subiu: boolean | null = null;
    if (real !== null && anterior !== null) {
      variacao = diferenca(real, anterior, indicador.fmt);
      const d = real - anterior;
      if (d !== 0) {
        subiu = d > 0;
        melhorou = indicador.dir === "up" ? d > 0 : d < 0;
      }
      // d === 0 fica null nos dois: repetir o mesmo número não é melhora nem
      // piora, e não há movimento para a seta apontar.
    }
    if (real !== null) anterior = real;

    pontos.push({
      mes,
      realizado: real === null ? "" : fmt(real, indicador.fmt),
      variacao,
      subiu,
      melhorou,
    });
  }

  const primeiro = pontos.findIndex((p) => p.realizado !== "");
  return primeiro <= 0 ? pontos : pontos.slice(primeiro);
}
