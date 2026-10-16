// Resumo do mês de uma unidade: o que está fora do ritmo e quem ainda não
// lançou. É o conteúdo da mensagem automática (n8n/Take) e também serve de
// resposta a quem quiser o estado do painel sem abrir a tela.
//
// Funções puras: recebem os lançamentos já lidos do banco e devolvem o resumo,
// sem tocar em banco nem em data do sistema (a data de corte vem por parâmetro).

import {
  isGrupo,
  type Formato,
  type Indicador,
  type LinhaTabela,
  type Unidade,
} from "./indicadores";
import { diasUteisRestantes, num, resolveMeta, ritmoNecessario, status } from "./indicadoresCalc";

export type LancamentoLido = { mes: string; tipo: "real" | "meta"; chave: string; valor: string | null };

export type ItemResumo = {
  nivel: "N3" | "N4" | "N5";
  /** Nome da pessoa quando o indicador é do N5. */
  pessoa: string | null;
  indicador: string;
  fmt: Formato;
  meta: number | null;
  realizado: number | null;
  /** Atingimento sobre a meta PROPORCIONAL aos dias úteis decorridos. */
  atingimento: number | null;
  /** Quanto precisa sair por dia útil restante; null quando não se aplica. */
  faltaPorDia: number | null;
};

export type ResumoUnidade = {
  unidade: string;
  nome: string;
  mes: string;
  fechado: boolean;
  diasUteisRestantes: number;
  /** Indicadores lançados cujo atingimento está abaixo do limite. */
  atrasados: ItemResumo[];
  /** Pessoas do N5 sem nenhum lançamento no mês. */
  semLancamento: string[];
  /** Indicadores com meta e sem realizado lançado — o buraco do mês. */
  semRealizado: number;
};

/**
 * Abaixo de 85% é vermelho no painel (ver `status`). O resumo usa o mesmo
 * corte para não contar uma história diferente da tela: o que chega na
 * mensagem é o que está vermelho lá.
 */
const LIMITE_ATRASO = 85;

function indicadoresDe(defs: LinhaTabela[]): Indicador[] {
  return defs.filter((l): l is Indicador => !isGrupo(l));
}

/**
 * Monta o resumo de uma unidade. `ate` é a data de corte (normalmente hoje, ou
 * o último dia do mês quando o mês já passou) — é dela que saem a meta
 * proporcional e os dias úteis restantes.
 */
export function montarResumo(args: {
  unidade: Unidade;
  mes: string;
  valores: LancamentoLido[];
  fechado: boolean;
  ini: string;
  ate: string;
}): ResumoUnidade {
  const { unidade, mes, valores, fechado, ini, ate } = args;

  const reais: Record<string, string> = {};
  const overrides: Record<string, number | null> = {};
  for (const v of valores) {
    if (v.mes !== mes) continue;
    if (v.tipo === "real") reais[v.chave] = v.valor ?? "";
    else overrides[v.chave] = num(v.valor);
  }

  const atrasados: ItemResumo[] = [];
  let semRealizado = 0;

  const avaliar = (ind: Indicador, chave: string, nivel: ItemResumo["nivel"], pessoa: string | null) => {
    if (ind.meta === null) return; // indicador em baseline não entra no resumo
    const { base, proporcional } = resolveMeta(ind, chave, overrides, ini, ate);
    if (base === null) return; // mês sem cronograma: não há o que cobrar
    const real = num(reais[chave]);
    if (real === null) {
      semRealizado++;
      return;
    }
    const st = status(real, proporcional, ind.dir);
    if (st.pct === null || st.pct >= LIMITE_ATRASO) return;
    const ritmo = ritmoNecessario(ind, base, real, ate);
    atrasados.push({
      nivel,
      pessoa,
      indicador: ind.nome,
      fmt: ind.fmt,
      meta: proporcional,
      realizado: real,
      atingimento: st.pct,
      faltaPorDia: ritmo?.porDia ?? null,
    });
  };

  for (const ind of indicadoresDe(unidade.n3)) avaliar(ind, ind.id, "N3", null);
  for (const ind of indicadoresDe(unidade.n4)) avaliar(ind, ind.id, "N4", null);

  const semLancamento: string[] = [];
  for (const p of unidade.pessoas) {
    const quem = p.nome.split(" — ")[0];
    let lancouAlgo = false;
    for (const ind of p.kpis) {
      const chave = `${p.chave}_${ind.id}`;
      if (num(reais[chave]) !== null) lancouAlgo = true;
      avaliar(ind, chave, "N5", quem);
    }
    if (!lancouAlgo) semLancamento.push(quem);
  }

  // Pior primeiro: a mensagem é lida de cima, e quem está em 30% importa mais
  // que quem está em 84%.
  atrasados.sort((a, b) => (a.atingimento ?? 0) - (b.atingimento ?? 0));

  return {
    unidade: unidade.slug,
    nome: unidade.nome,
    mes,
    fechado,
    diasUteisRestantes: diasUteisRestantes(ate),
    atrasados,
    semLancamento,
    semRealizado,
  };
}
