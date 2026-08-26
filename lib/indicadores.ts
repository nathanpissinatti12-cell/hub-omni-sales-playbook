// Definições do Painel de Indicadores N3 (Head) / N4 (Supervisão) / N5 (Operação).
// Transcrito do painel HTML original mantendo metas, escalas e direções idênticas.
//
// dir  — 'up' = quanto maior melhor | 'down' = quanto menor melhor
// esc  — escala de proporcionalização da meta:
//        'mes' proporcional aos dias úteis decorridos do mês
//        'tri' / 'ano' ponderados pelas metas mensais do cronograma
//        null  não proporcionaliza (taxas e valores unitários)
// meta — null significa indicador em baseline, sem meta definida ainda

export type Formato = "brl" | "pct" | "x" | "num";
export type Direcao = "up" | "down";
export type Escala = "mes" | "tri" | "ano" | null;

export type Indicador = {
  id: string;
  nome: string;
  hint?: string;
  meta: number | null;
  fmt: Formato;
  dir: Direcao;
  esc: Escala;
};

/** Cabeçalho de agrupamento dentro de uma tabela. */
export type Grupo = { grupo: string; cor?: "p4" | "p5" };

export type LinhaTabela = Indicador | Grupo;

export function isGrupo(l: LinhaTabela): l is Grupo {
  return (l as Grupo).grupo !== undefined;
}

// ---------------------------------------------------------------------------
// Cronograma de metas de MRR novo. O ciclo do ARR começa em ago/2026.
// As metas crescem mês a mês, então a meta proporcional do trimestre e do ARR
// é ponderada por mês — não por dia útil uniforme.
// ---------------------------------------------------------------------------
export const CRONOGRAMA: Record<string, { out: number; inb: number }> = {
  "2026-08": { out: 7765, inb: 1941 },
  "2026-09": { out: 8482, inb: 2121 },
  "2026-10": { out: 9254, inb: 2313 },
  "2026-11": { out: 10080, inb: 2520 },
  "2026-12": { out: 10965, inb: 2741 },
};

export const CICLO_ANUAL = { ini: "2026-08-01", fim: "2026-12-31" };

export function mesesCiclo(): string[] {
  return Object.keys(CRONOGRAMA).sort();
}

const MESES_ABREV = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function rotuloMes(chave: string): string {
  const [ano, mes] = chave.split("-");
  return `${MESES_ABREV[Number(mes) - 1]}/${ano.slice(2)}`;
}

// ---------------------------------------------------------------------------
// N3 — Head Comercial
// ---------------------------------------------------------------------------
export const N3: LinhaTabela[] = [
  { grupo: "Com meta" },
  {
    id: "n3_mrr_out",
    nome: "MRR novo — outbound",
    hint: "meta do mês selecionado · cronograma ago–dez/2026",
    meta: 7765,
    fmt: "brl",
    dir: "up",
    esc: "mes",
  },
  {
    id: "n3_mrr_in",
    nome: "MRR novo — inbound",
    hint: "meta do mês selecionado · cronograma ago–dez/2026",
    meta: 1941,
    fmt: "brl",
    dir: "up",
    esc: "mes",
  },
  {
    id: "n3_cac",
    nome: "CAC Outbound",
    hint: "custo outbound ÷ clientes conquistados",
    meta: 4000,
    fmt: "brl",
    dir: "down",
    esc: null,
  },
  {
    id: "n3_conc",
    nome: "Concentração de risco",
    hint: "% do MRR fechado por Gabriel · meta até dez/2026",
    meta: 50,
    fmt: "pct",
    dir: "down",
    esc: null,
  },
  {
    id: "n3_fc",
    nome: "Forecast",
    hint: "cobertura de pipeline sobre a meta",
    meta: 8,
    fmt: "x",
    dir: "up",
    esc: null,
  },
  {
    id: "n3_tri",
    nome: "Resultado do trimestre",
    hint: "acumulado do trimestre · ponderado pelas metas mensais decorridas",
    meta: 20309,
    fmt: "brl",
    dir: "up",
    esc: "tri",
  },
  {
    id: "n3_gxp",
    nome: "Conversão ganhos × perdidos",
    hint: "ganhos ÷ negócios finalizados",
    meta: 20,
    fmt: "pct",
    dir: "up",
    esc: null,
  },
  {
    id: "n3_arr",
    nome: "ARR",
    hint: "ciclo ago–dez/2026 · ponderado pelas metas mensais decorridas",
    meta: 58182,
    fmt: "brl",
    dir: "up",
    esc: "ano",
  },
  {
    id: "n3_tkt",
    nome: "Ticket médio",
    hint: "MRR novo ÷ negócios ganhos",
    meta: 4000,
    fmt: "brl",
    dir: "up",
    esc: null,
  },
  { grupo: "Sem meta — baseline em construção" },
  {
    id: "n3_cac_in",
    nome: "CAC Inbound",
    hint: "custo inbound ÷ clientes conquistados",
    meta: null,
    fmt: "brl",
    dir: "down",
    esc: null,
  },
  {
    id: "n3_roi",
    nome: "ROI por canal — outbound",
    hint: "(receita − custo) ÷ custo",
    meta: null,
    fmt: "x",
    dir: "up",
    esc: null,
  },
  {
    id: "n3_roi_in",
    nome: "ROI por canal — inbound",
    hint: "(receita − custo) ÷ custo",
    meta: null,
    fmt: "x",
    dir: "up",
    esc: null,
  },
  {
    id: "n3_ltv",
    nome: "LTV / CAC",
    hint: "referência de mercado ≥ 3:1",
    meta: null,
    fmt: "x",
    dir: "up",
    esc: null,
  },
];

// ---------------------------------------------------------------------------
// N4 — Supervisão (agregado por função)
// ---------------------------------------------------------------------------
export const N4: LinhaTabela[] = [
  { grupo: "BDR", cor: "p4" },
  { id: "n4_reun", nome: "Reuniões agendadas", meta: 165, fmt: "num", dir: "up", esc: "mes" },
  { id: "n4_sql", nome: "SQL", meta: 80, fmt: "num", dir: "up", esc: "mes" },
  {
    id: "n4_real",
    nome: "Conversão reunião realizada",
    hint: "SAL → realizada",
    meta: 95,
    fmt: "pct",
    dir: "up",
    esc: null,
  },
  {
    id: "n4_gxp",
    nome: "Conversão ganhos × perdidos",
    hint: "sobre finalizados",
    meta: 20,
    fmt: "pct",
    dir: "up",
    esc: null,
  },
  {
    id: "n4_cni",
    nome: "Custo por negócio iniciado",
    hint: "movido de N3",
    meta: 110,
    fmt: "brl",
    dir: "down",
    esc: null,
  },
  { grupo: "Closer (agregado)", cor: "p4" },
  { id: "n4_mrr", nome: "MRR novo", hint: "soma dos closers", meta: 9706, fmt: "brl", dir: "up", esc: "mes" },
  { id: "n4_fc", nome: "Forecast", hint: "cobertura sobre a meta", meta: 8, fmt: "x", dir: "up", esc: null },
  { id: "n4_sn", nome: "Lead SAL → Negociação", meta: 80, fmt: "pct", dir: "up", esc: null },
  { id: "n4_ng", nome: "Negociação → Ganho", meta: 20, fmt: "pct", dir: "up", esc: null },
];

// ---------------------------------------------------------------------------
// N5 — Operação individual
// ---------------------------------------------------------------------------
export const BDR_PADRAO: Indicador[] = [
  { id: "ini", nome: "Leads iniciados", meta: 175, fmt: "num", dir: "up", esc: "mes" },
  { id: "fin", nome: "Leads finalizados", meta: 175, fmt: "num", dir: "up", esc: "mes" },
  { id: "conv", nome: "Conversão", meta: 20, fmt: "pct", dir: "up", esc: null },
  { id: "reun", nome: "Reunião agendada", meta: 35, fmt: "num", dir: "up", esc: "mes" },
  { id: "sql", nome: "Lead SQL", meta: 30, fmt: "num", dir: "up", esc: "mes" },
  { id: "ns", nome: "No-show", meta: 15, fmt: "pct", dir: "down", esc: null },
  { id: "evo", nome: "Nota EvoluAI", meta: 90, fmt: "num", dir: "up", esc: null },
  { id: "min", nome: "Minutos falados", meta: 1500, fmt: "num", dir: "up", esc: "mes" },
  { id: "ot", nome: "On-time", meta: 90, fmt: "pct", dir: "up", esc: null },
];

/** BDR em rampagem: metas reduzidas em conversão, reunião e SQL. */
export const BDR_RAMPA: Indicador[] = BDR_PADRAO.map((k) => {
  if (k.id === "conv") return { ...k, meta: 14 };
  if (k.id === "reun") return { ...k, meta: 25 };
  if (k.id === "sql") return { ...k, meta: 20 };
  return { ...k };
});

export function closerKpis(mrr: number, forecast: number): Indicador[] {
  return [
    { id: "sn", nome: "Lead SAL → Negociação", meta: 80, fmt: "pct", dir: "up", esc: null },
    { id: "ng", nome: "Negociação → Ganho", meta: 20, fmt: "pct", dir: "up", esc: null },
    { id: "mrr", nome: "MRR novo", meta: mrr, fmt: "brl", dir: "up", esc: "mes" },
    { id: "novos", nome: "Novos negócios", meta: 24, fmt: "num", dir: "up", esc: "mes" },
    { id: "fc", nome: "Forecast (cobertura)", meta: forecast, fmt: "brl", dir: "up", esc: null },
    { id: "ot", nome: "On-time", meta: 90, fmt: "pct", dir: "up", esc: null },
    { id: "gxp", nome: "Ganhos × perdidos", meta: 20, fmt: "pct", dir: "up", esc: null },
  ];
}

export type Pessoa = { chave: string; nome: string; kpis: Indicador[] };

const MRR_CLOSER = 4853;

export const PESSOAS: Pessoa[] = [
  { chave: "sara", nome: "Sara Pereira — BDR", kpis: BDR_PADRAO },
  { chave: "jeferson", nome: "Jeferson Nunes — BDR", kpis: BDR_PADRAO },
  { chave: "julia", nome: "Julia Lopes — BDR", kpis: BDR_PADRAO },
  { chave: "taemy", nome: "Taemy Mendonça — BDR", kpis: BDR_PADRAO },
  { chave: "jessica", nome: "Jéssica Alves — BDR (rampagem)", kpis: BDR_RAMPA },
  { chave: "joao", nome: "João Camilo — Closer Black", kpis: closerKpis(MRR_CLOSER, MRR_CLOSER * 8) },
  { chave: "gabriel", nome: "Gabriel Donadeli — Closer Black", kpis: closerKpis(MRR_CLOSER, MRR_CLOSER * 8) },
];

/** Todos os indicadores de N3 e N4 achatados — usado no seletor de evolução. */
export function indicadoresPlanos(): Indicador[] {
  return [...N3, ...N4].filter((l): l is Indicador => !isGrupo(l));
}
