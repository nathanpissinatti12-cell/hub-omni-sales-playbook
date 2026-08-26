// Cálculos do Painel de Indicadores: dias úteis, meta proporcional e semáforo.
// Funções puras — nenhuma delas toca no DOM ou no banco, então dá pra testar
// isoladamente e reutilizar tanto no servidor quanto no cliente.

import { CICLO_ANUAL, CRONOGRAMA, type Direcao, type Escala, type Formato, type Indicador } from "./indicadores";

export function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isNaN(n) ? null : n;
}

export function fmt(v: number | null, t: Formato): string {
  if (v === null || Number.isNaN(v)) return "—";
  if (t === "brl") {
    return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (t === "pct") return v.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "%";
  if (t === "x") return v.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + "x";
  return v.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

// --------------------------------------------------------------------------
// Datas e dias úteis
// --------------------------------------------------------------------------

/** Formata um Date como YYYY-MM-DD sem passar por UTC (evita virar o dia). */
export function iso(d: Date): string {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

/** Meio-dia evita que fuso horário empurre a data pro dia anterior/seguinte. */
function parseData(s: string): Date {
  return new Date(s + "T12:00:00");
}

/** Dias úteis (seg–sex) no intervalo fechado [ini, fim]. Não considera feriados. */
export function diasUteis(ini: string, fim: string): number {
  if (!ini || !fim) return 0;
  const d = parseData(ini);
  const f = parseData(fim);
  if (d > f) return 0;
  let c = 0;
  while (d <= f) {
    const w = d.getDay();
    if (w !== 0 && w !== 6) c++;
    d.setDate(d.getDate() + 1);
  }
  return c;
}

export function diasUteisDoMes(ref: string): number {
  if (!ref) return 0;
  const d = parseData(ref);
  return diasUteis(
    iso(new Date(d.getFullYear(), d.getMonth(), 1)),
    iso(new Date(d.getFullYear(), d.getMonth() + 1, 0))
  );
}

export function chaveMes(d: Date): string {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

export function limitesMes(ref: string) {
  const d = parseData(ref);
  return {
    ini: iso(new Date(d.getFullYear(), d.getMonth(), 1)),
    fim: iso(new Date(d.getFullYear(), d.getMonth() + 1, 0)),
    chave: chaveMes(d),
  };
}

export function limitesTrimestre(ref: string) {
  const d = parseData(ref);
  const q = Math.floor(d.getMonth() / 3);
  return {
    ini: iso(new Date(d.getFullYear(), q * 3, 1)),
    fim: iso(new Date(d.getFullYear(), q * 3 + 3, 0)),
  };
}

/** Fração do mês já decorrida (em dias úteis) até a data informada. */
export function fracaoMes(chave: string, ate: string): number {
  const [ano, mes] = chave.split("-").map(Number);
  const ini = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 0);
  const alvo = parseData(ate);
  if (alvo < ini) return 0;
  if (alvo >= fim) return 1;
  const total = diasUteis(iso(ini), iso(fim));
  return total > 0 ? diasUteis(iso(ini), ate) / total : 0;
}

/**
 * Soma as metas do cronograma dentro de uma janela, devolvendo o total cheio e
 * o quanto dele já "venceu" até a data de corte. Como as metas crescem mês a
 * mês, ponderar por mês é diferente de proporcionalizar por dia útil uniforme.
 */
export function somaCronograma(iniJanela: string, fimJanela: string, ate: string, campo?: "out" | "inb") {
  let total = 0;
  let proporcional = 0;
  for (const k of Object.keys(CRONOGRAMA)) {
    const [ano, mes] = k.split("-").map(Number);
    const primeiroDia = iso(new Date(ano, mes - 1, 1));
    if (primeiroDia < iniJanela || primeiroDia > fimJanela) continue;
    const v = campo ? CRONOGRAMA[k][campo] : CRONOGRAMA[k].out + CRONOGRAMA[k].inb;
    total += v;
    proporcional += v * fracaoMes(k, ate);
  }
  return { total, proporcional };
}

// --------------------------------------------------------------------------
// Fatores de proporcionalização
// --------------------------------------------------------------------------

export function fatorMes(ini: string, fim: string): number {
  const dp = diasUteis(ini, fim);
  const dm = diasUteisDoMes(ini);
  return dm > 0 ? dp / dm : 1;
}

export function fatorTrimestre(fim: string): number {
  if (!fim) return 0;
  const L = limitesTrimestre(fim);
  const s = somaCronograma(L.ini, L.fim, fim);
  return s.total > 0 ? s.proporcional / s.total : 0;
}

export function fatorAno(fim: string): number {
  if (!fim) return 0;
  const s = somaCronograma(CICLO_ANUAL.ini, CICLO_ANUAL.fim, fim);
  return s.total > 0 ? s.proporcional / s.total : 0;
}

export function fatorDe(esc: Escala, ini: string, fim: string): number {
  if (esc === "mes") return fatorMes(ini, fim);
  if (esc === "tri") return fatorTrimestre(fim);
  if (esc === "ano") return fatorAno(fim);
  return 1;
}

/**
 * Meta cheia dinâmica: MRR mensal vem do cronograma do mês selecionado;
 * trimestre e ARR vêm da soma da janela. Demais indicadores usam a meta fixa.
 */
export function metaDinamica(ind: Indicador, ini: string, fim: string): number | null {
  if (!ini || !fim) return null;
  if (ind.id === "n3_mrr_out" || ind.id === "n3_mrr_in") {
    const m = limitesMes(ini).chave;
    if (!CRONOGRAMA[m]) return null;
    return ind.id === "n3_mrr_out" ? CRONOGRAMA[m].out : CRONOGRAMA[m].inb;
  }
  if (ind.id === "n3_tri") {
    const L = limitesTrimestre(fim);
    return somaCronograma(L.ini, L.fim, fim).total;
  }
  if (ind.id === "n3_arr") {
    return somaCronograma(CICLO_ANUAL.ini, CICLO_ANUAL.fim, fim).total;
  }
  return null;
}

// --------------------------------------------------------------------------
// Semáforo de atingimento
// --------------------------------------------------------------------------

export type Situacao = "ok" | "warn" | "bad" | "na";

export type Atingimento = { situacao: Situacao; pct: number | null };

/** Verde ≥ 100% · amarelo ≥ 85% · vermelho abaixo disso. */
export function status(real: number | null, meta: number | null, dir: Direcao): Atingimento {
  if (real === null || meta === null || meta === 0) return { situacao: "na", pct: null };
  const pct = dir === "down" ? (meta / real) * 100 : (real / meta) * 100;
  if (!Number.isFinite(pct)) return { situacao: "na", pct: null };
  if (pct >= 100) return { situacao: "ok", pct };
  if (pct >= 85) return { situacao: "warn", pct };
  return { situacao: "bad", pct };
}

export const CORES: Record<Situacao, string> = {
  ok: "#0F9D58",
  warn: "#B45309",
  bad: "#DC2626",
  na: "#8B8399",
};

export function corDe(pct: number | null): string {
  if (pct === null) return CORES.na;
  if (pct >= 100) return CORES.ok;
  if (pct >= 85) return CORES.warn;
  return CORES.bad;
}

/**
 * Resolve a meta de um indicador: override manual > meta dinâmica do
 * cronograma > meta fixa da definição. Devolve também a versão proporcional.
 */
export function resolveMeta(
  ind: Indicador,
  chave: string,
  overrides: Record<string, number | null>,
  ini: string,
  fim: string
): { base: number | null; proporcional: number | null } {
  if (ind.meta === null) return { base: null, proporcional: null };
  const override = overrides[chave];
  const dinamica = metaDinamica(ind, ini, fim);
  const base = override !== undefined && override !== null ? override : dinamica !== null ? dinamica : ind.meta;
  return { base, proporcional: base === null ? null : base * fatorDe(ind.esc, ini, fim) };
}
