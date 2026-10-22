// Cálculos do Painel de Indicadores: dias úteis, meta proporcional e semáforo.
// Funções puras — nenhuma delas toca no DOM ou no banco, então dá pra testar
// isoladamente e reutilizar tanto no servidor quanto no cliente.

import {
  CRONOGRAMA,
  cicloAnualDe,
  dependeDoCronograma,
  type Direcao,
  type Escala,
  type Formato,
  type Indicador,
} from "./indicadores";

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

/**
 * Só o número formatado em pt-BR, sem o símbolo da unidade — os campos do
 * painel mostram R$ / % / x ao lado do input, não dentro dele.
 */
export function fmtNumero(v: number | null, t: Formato): string {
  if (v === null || Number.isNaN(v)) return "";
  if (t === "brl") {
    return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return v.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

/**
 * Lê o que foi digitado num campo do painel e devolve o número canônico (ponto
 * decimal) pra gravar, ou null quando o texto ainda não é um número válido —
 * nesse caso quem chama mantém o rascunho na tela sem gravar nada.
 *
 * Aceita as duas convenções porque as duas aparecem na prática: o usuário
 * digita "9.202,05" e o valor que volta do banco é "9202.05". Quando não há
 * vírgula, o ponto é desempatado pelo tamanho do último grupo: 3 dígitos é
 * separador de milhar ("9.202"), qualquer outro tamanho é decimal ("9202.05").
 */
export function parseNumeroBr(texto: string): string | null {
  const limpo = texto.trim();
  if (limpo === "") return "";

  let normalizado: string;
  if (limpo.includes(",")) {
    normalizado = limpo.replace(/\./g, "").replace(",", ".");
  } else {
    const grupos = limpo.split(".");
    const ultimo = grupos[grupos.length - 1];
    normalizado = grupos.length > 1 && ultimo.length === 3 ? limpo.replace(/\./g, "") : limpo;
  }

  if (!/^-?\d*\.?\d*$/.test(normalizado)) return null;
  const n = Number(normalizado);
  return Number.isFinite(n) ? String(n) : null;
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

/**
 * Fração do ciclo de ARR decorrida. O ciclo é o do ANO da data informada: em
 * 2027 ainda não há cronograma, então não há ciclo e o painel mostra travessão
 * em vez de um 0% que pareceria "nada aconteceu".
 */
export function fatorAno(fim: string): number | null {
  if (!fim) return null;
  const ciclo = cicloAnualDe(parseData(fim).getFullYear());
  if (!ciclo) return null;
  const s = somaCronograma(ciclo.ini, ciclo.fim, fim);
  return s.total > 0 ? s.proporcional / s.total : 0;
}

export function fatorDe(esc: Escala, ini: string, fim: string): number {
  if (esc === "mes") return fatorMes(ini, fim);
  if (esc === "tri") return fatorTrimestre(fim);
  if (esc === "ano") return fatorAno(fim) ?? 0;
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
    const { total } = somaCronograma(L.ini, L.fim, fim);
    // Trimestre sem nenhum mês no cronograma (jan–jul/2026, qualquer mês de
    // 2027 enquanto o ciclo não for definido): não existe meta, e devolver 0
    // viria à tela como "meta R$ 0,00".
    return total > 0 ? total : null;
  }
  return null;
}

// --------------------------------------------------------------------------
// Ritmo necessário — o que falta por dia útil restante
// --------------------------------------------------------------------------

/** Dia seguinte a uma data ISO, como ISO. */
export function diaSeguinte(ref: string): string {
  const d = parseData(ref);
  d.setDate(d.getDate() + 1);
  return iso(d);
}

/**
 * Dias úteis que ainda restam no mês depois da data de corte. Conta a partir do
 * dia SEGUINTE porque o dia do corte já entrou como decorrido na meta
 * proporcional — somar nos dois lados contaria o mesmo dia duas vezes.
 */
export function diasUteisRestantes(ate: string): number {
  if (!ate) return 0;
  return diasUteis(diaSeguinte(ate), limitesMes(ate).fim);
}

export type Ritmo = {
  /** Quanto falta para a meta CHEIA do mês (nunca a proporcional). */
  falta: number;
  diasRestantes: number;
  /** falta ÷ dias restantes; null quando não sobrou dia útil no mês. */
  porDia: number | null;
};

/**
 * Quanto falta por dia útil restante para fechar o mês na meta.
 *
 * Só faz sentido para indicador que ACUMULA ao longo do mês e em que mais é
 * melhor (reuniões, SAL, MRR novo, leads). Devolve null para o resto:
 *
 * - taxa e valor unitário (esc null — conversão, ticket, CAC): a média do mês
 *   não é a soma dos dias, então "falta x por dia" seria número inventado;
 * - trimestre e ciclo anual (esc 'tri'/'ano'): o que falta ali não se resolve
 *   nos dias úteis deste mês;
 * - indicador de "quanto menor melhor" (dir 'down' — no-show, CAC): não há o
 *   que correr atrás por dia, o alvo é não passar do teto.
 */
export function ritmoNecessario(
  ind: Indicador,
  base: number | null,
  real: number | null,
  ate: string
): Ritmo | null {
  if (ind.esc !== "mes" || ind.dir !== "up") return null;
  if (base === null || !ate) return null;

  const falta = Math.max(0, base - (real ?? 0));
  const diasRestantes = diasUteisRestantes(ate);
  return {
    falta,
    diasRestantes,
    porDia: diasRestantes > 0 ? falta / diasRestantes : null,
  };
}

/**
 * Onde o mês fecha se o ritmo de até agora continuar: realizado dividido pelos
 * dias úteis decorridos, vezes os dias úteis do mês inteiro.
 *
 * Vale para o mesmo conjunto de `ritmoNecessario` — indicador que acumula no
 * mês e em que mais é melhor. As duas contas são complementares e é por isso
 * que valem juntas na tela: uma diz o que falta por dia, a outra diz onde se
 * chega sem mudar nada.
 *
 * Null quando ainda não há dia útil decorrido (começo do mês) ou nada lançado —
 * projetar a partir de zero daria sempre zero, que pareceria previsão.
 */
export function projecaoFechamento(
  ind: Indicador,
  real: number | null,
  ini: string,
  ate: string
): number | null {
  if (ind.esc !== "mes" || ind.dir !== "up") return null;
  if (real === null || !ini || !ate) return null;
  const decorridos = diasUteis(ini, ate);
  const totais = diasUteisDoMes(ate);
  if (decorridos <= 0 || totais <= 0) return null;
  return (real / decorridos) * totais;
}

// --------------------------------------------------------------------------
// Semáforo de atingimento
// --------------------------------------------------------------------------

export type Situacao = "ok" | "warn" | "bad" | "na";

export type Atingimento = { situacao: Situacao; pct: number | null };

/** Verde ≥ 100% · amarelo ≥ 85% · vermelho abaixo disso. */
export function status(real: number | null, meta: number | null, dir: Direcao): Atingimento {
  if (real === null || meta === null || meta === 0) return { situacao: "na", pct: null };
  // Zero num indicador de "quanto menor melhor" (no-show, churn, dormentes) é o
  // melhor resultado possível, mas meta ÷ 0 não é número: sem este caso o
  // painel caía em "na" e mostrava travessão cinza — o mês perfeito lido como
  // mês sem lançamento, fora da contagem de fora-da-meta, fora do ranking e
  // fora da prioridade do RMR. Registra meta batida; 100% em vez de infinito
  // porque a porcentagem vai para eixo de gráfico e para toFixed.
  if (dir === "down" && real === 0) return { situacao: "ok", pct: 100 };
  const pct = dir === "down" ? (meta / real) * 100 : (real / meta) * 100;
  if (!Number.isFinite(pct)) return { situacao: "na", pct: null };
  if (pct >= 100) return { situacao: "ok", pct };
  if (pct >= 85) return { situacao: "warn", pct };
  return { situacao: "bad", pct };
}

/**
 * Cores do semáforo quando viram TEXTO (o % na tabela, o rótulo no gráfico).
 * Precisam de 4,5:1 sobre o fundo claro, que é o mínimo da WCAG para texto
 * pequeno — por isso são tons fechados: 5,4 / 5,0 / 4,8 / 5,3.
 */
export const CORES: Record<Situacao, string> = {
  ok: "#0B7A43",
  warn: "#B45309",
  bad: "#DC2626",
  na: "#6F6881",
};

/**
 * As mesmas situações quando viram ÁREA (barra, ponto, linha). Aqui o mínimo é
 * 3:1, então dá pra usar tons mais vivos — e isso importa: o âmbar escuro do
 * texto, numa barra grande ao lado de verde e rosa, lê como marrom e ninguém
 * associa a "quase na meta".
 */
export const CORES_AREA: Record<Situacao, string> = {
  ok: "#0F9D58",
  warn: "#D97706",
  bad: "#DC2626",
  na: "#B9B3D4",
};

function situacaoDe(pct: number | null): Situacao {
  if (pct === null) return "na";
  if (pct >= 100) return "ok";
  if (pct >= 85) return "warn";
  return "bad";
}

export function corDe(pct: number | null): string {
  return CORES[situacaoDe(pct)];
}

/** Cor de preenchimento para barra, ponto e linha — ver CORES_AREA. */
export function corAreaDe(pct: number | null): string {
  return CORES_AREA[situacaoDe(pct)];
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
  // Indicador de cronograma em mês sem cronograma fica SEM meta, a menos que
  // alguém tenha digitado uma. Cair na meta fixa da definição faria jan/2026 e
  // todo o 2027 exibirem a meta de agosto/2026 como se fosse deles.
  if (dinamica === null && dependeDoCronograma(ind.id)) {
    const manual = override !== undefined && override !== null ? override : null;
    return {
      base: manual,
      proporcional: manual === null ? null : manual * fatorDe(ind.esc, ini, fim),
    };
  }
  const base = override !== undefined && override !== null ? override : dinamica !== null ? dinamica : ind.meta;
  return { base, proporcional: base === null ? null : base * fatorDe(ind.esc, ini, fim) };
}
