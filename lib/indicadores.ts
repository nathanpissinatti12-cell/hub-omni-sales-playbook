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

/**
 * Anos que o painel oferece no seletor de ciclo. 2027 está aqui SEM cronograma
 * de MRR de propósito: em janeiro a operação precisa poder lançar reunião, SAL
 * e leads mesmo que a meta de MRR do ano novo ainda não tenha sido definida —
 * esses indicadores não dependem do cronograma. Enquanto não houver cronograma,
 * os indicadores de MRR aparecem como "sem meta" no mês, em vez de herdar um
 * número de outro ciclo.
 *
 * Para abrir o ciclo seguinte: acrescente as chaves do ano em CRONOGRAMA e o
 * ano nesta lista. Nada mais precisa mudar.
 */
export const ANOS_PAINEL = [2026, 2027];

/**
 * Ciclo que o painel abre por padrão: o ano corrente quando ele está na lista,
 * senão o último cadastrado. Sem isto, virado o ano o painel abriria no
 * primeiro item da lista — em janeiro de 2027, mostraria jan/2026.
 */
export function anoPainelPadrao(hoje = new Date()): number {
  const ano = hoje.getFullYear();
  return ANOS_PAINEL.includes(ano) ? ano : ANOS_PAINEL[ANOS_PAINEL.length - 1];
}

/**
 * Os 12 meses de um ano, e não só os do cronograma de MRR. O painel precisa
 * deles por dois motivos: o gráfico de evolução mostra o ano inteiro, e
 * indicadores que não são MRR (CAC, conversão, reunião) existem o ano todo.
 * Mês fora do cronograma simplesmente não tem meta de MRR — ver CRONOGRAMA.
 */
export function mesesCiclo(ano: number = anoPainelPadrao()): string[] {
  return Array.from({ length: 12 }, (_, i) => `${ano}-${String(i + 1).padStart(2, "0")}`);
}

/** Todos os meses de todos os ciclos — o que a API aceita como competência. */
export function mesesValidos(): string[] {
  return ANOS_PAINEL.flatMap((ano) => mesesCiclo(ano));
}

/**
 * Janela do ciclo de ARR de um ano: do primeiro ao último mês que têm meta no
 * cronograma (em 2026, ago–dez). Null quando o ano ainda não tem cronograma —
 * aí não há ciclo de ARR para medir, e o painel mostra travessão em vez de 0%.
 */
export function cicloAnualDe(ano: number): { ini: string; fim: string } | null {
  const chaves = Object.keys(CRONOGRAMA)
    .filter((k) => k.startsWith(`${ano}-`))
    .sort();
  if (chaves.length === 0) return null;
  const primeiro = chaves[0];
  const [a, m] = chaves[chaves.length - 1].split("-").map(Number);
  const ultimoDia = new Date(a, m, 0).getDate();
  return { ini: `${primeiro}-01`, fim: `${a}-${String(m).padStart(2, "0")}-${ultimoDia}` };
}

/**
 * Indicadores cuja meta vem do cronograma de MRR. Em mês sem cronograma eles
 * ficam sem meta — nunca caem na meta fixa da definição, que é a de agosto/2026
 * e não diz nada sobre outro mês.
 */
export function dependeDoCronograma(id: string): boolean {
  return id === "n3_mrr_out" || id === "n3_mrr_in" || id === "n3_tri";
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
  {
    id: "n3_mrr_out",
    nome: "MRR novo — outbound",
    hint: "meta do mês selecionado · cronograma do ciclo",
    meta: 7765,
    fmt: "brl",
    dir: "up",
    esc: "mes",
  },
  {
    id: "n3_mrr_in",
    nome: "MRR novo — inbound",
    hint: "meta do mês selecionado · cronograma do ciclo",
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
    hint: "% do MRR fechado por Gabriel",
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
    id: "n3_tkt",
    nome: "Ticket médio",
    hint: "MRR novo ÷ negócios ganhos",
    meta: 4000,
    fmt: "brl",
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
  // O id segue "n4_sql" mesmo com o nome trocado pra SAL: ele é a chave dos
  // lançamentos já gravados em indicadores_valores, e renomear perderia o
  // histórico.
  { id: "n4_sql", nome: "SAL", meta: 80, fmt: "num", dir: "up", esc: "mes" },
  {
    id: "n4_real",
    nome: "Conversão reunião realizada",
    hint: "realizada → SAL",
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

/**
 * `chave` é a identidade da pessoa no banco: todo lançamento do N5 é gravado
 * como `<chave>_<id do indicador>`, dentro da unidade e do mês.
 *
 * Por isso trocar a chave = começar do zero, e isso é intencional: quando sai
 * alguém e entra outra pessoa na vaga, a nova não deve herdar nota, meta nem
 * histórico de quem saiu — é só cadastrar com chave nova. O dado antigo
 * continua no banco, apenas deixa de aparecer. O contrário também vale:
 * mexer só no `nome` (corrigir grafia, mudar o rótulo da função) preserva
 * tudo que já foi lançado, porque a chave não mudou.
 *
 * Como o lançamento também carrega a unidade, a mesma pessoa em duas unidades
 * são dois registros independentes.
 */
export type Pessoa = { chave: string; nome: string; kpis: Indicador[] };

const MRR_CLOSER = 4853;

/** Closer padrão: meta de MRR do mês e cobertura de forecast de 8x. */
function closer(chave: string, nome: string): Pessoa {
  return { chave, nome, kpis: closerKpis(MRR_CLOSER, MRR_CLOSER * 8) };
}

function bdr(chave: string, nome: string): Pessoa {
  return { chave, nome, kpis: BDR_PADRAO };
}

export const PESSOAS: Pessoa[] = [
  { chave: "sara", nome: "Sara Pereira — BDR", kpis: BDR_PADRAO },
  { chave: "jeferson", nome: "Jeferson Nunes — BDR", kpis: BDR_PADRAO },
  { chave: "julia", nome: "Julia Lopes — BDR", kpis: BDR_PADRAO },
  { chave: "taemy", nome: "Taemy Mendonça — BDR", kpis: BDR_PADRAO },
  { chave: "jessica", nome: "Jéssica Alves — BDR (rampagem)", kpis: BDR_RAMPA },
  { chave: "joao", nome: "João Camilo — Closer Black", kpis: closerKpis(MRR_CLOSER, MRR_CLOSER * 8) },
  { chave: "gabriel", nome: "Gabriel Donadeli — Closer Black", kpis: closerKpis(MRR_CLOSER, MRR_CLOSER * 8) },
];

// Times das demais unidades (informados em 15/10/2026). Closers usam a mesma
// meta de MRR de Cerquilho por enquanto — quando a meta de cada unidade for
// definida, dá pra ajustar por mês direto na coluna Meta do painel, sem mexer
// aqui.
export const PESSOAS_TATUI: Pessoa[] = [
  closer("eduarda", "Eduarda — Closer"),
  closer("jose", "Jose — Closer"),
  bdr("carlos", "Carlos — BDR"),
  bdr("aline", "Aline — BDR"),
  bdr("helena", "Helena — BDR"),
];

export const PESSOAS_RIBEIRAO: Pessoa[] = [
  bdr("otavio", "Otavio — BDR"),
  bdr("nathalia", "Nathalia Dadalte — BDR"),
];

export const PESSOAS_PARTNERS: Pessoa[] = [bdr("alessandra", "Alessandra Thibes — BDR")];

/** Todos os indicadores de N3 e N4 achatados — usado no seletor de evolução. */
export function indicadoresPlanos(defs: LinhaTabela[] = [...N3, ...N4]): Indicador[] {
  return defs.filter((l): l is Indicador => !isGrupo(l));
}

// ---------------------------------------------------------------------------
// Unidades da Onvox
//
// Cerquilho, Tatuí, Ribeirão e Partners são operações comerciais e compartilham
// a mesma definição (N3/N4/N5 acima) — o que muda entre elas é só o lançamento,
// que o banco separa pela coluna `unidade`. O Mkt tem indicadores próprios e
// começa sem definição: a tela mostra um aviso até a lista ser preenchida em
// MKT_N3/MKT_N4/MKT_PESSOAS, em vez de exibir metas comerciais que não são dele.
// ---------------------------------------------------------------------------

/** Indicadores do Mkt. Vazio de propósito — ainda não definidos pelo time. */
export const MKT_N3: LinhaTabela[] = [];
export const MKT_N4: LinhaTabela[] = [];
export const MKT_PESSOAS: Pessoa[] = [];

export type Unidade = {
  slug: string;
  nome: string;
  /** false enquanto a unidade não tem indicador nenhum definido. */
  temDefinicao: boolean;
  n3: LinhaTabela[];
  n4: LinhaTabela[];
  pessoas: Pessoa[];
};

// Cada unidade tem o seu time no N5 — nunca repetir a mesma pessoa em duas,
// porque o N5 é nominal e isso lançaria meta individual no nome de quem não
// trabalha ali. Unidade sem time cadastrado mostra aviso no lugar da tabela.
export const UNIDADES: Unidade[] = [
  { slug: "cerquilho", nome: "Cerquilho", temDefinicao: true, n3: N3, n4: N4, pessoas: PESSOAS },
  { slug: "tatui", nome: "Tatuí", temDefinicao: true, n3: N3, n4: N4, pessoas: PESSOAS_TATUI },
  { slug: "mkt", nome: "Mkt", temDefinicao: false, n3: MKT_N3, n4: MKT_N4, pessoas: MKT_PESSOAS },
  { slug: "ribeirao", nome: "Ribeirão", temDefinicao: true, n3: N3, n4: N4, pessoas: PESSOAS_RIBEIRAO },
  { slug: "partners", nome: "Partners", temDefinicao: true, n3: N3, n4: N4, pessoas: PESSOAS_PARTNERS },
];

/** Unidade do painel que já existia antes da separação — recebe o histórico. */
export const UNIDADE_PADRAO = "cerquilho";

/**
 * A mesma unidade, com o N5 reduzido a quem está vinculado a um usuário.
 *
 * O cadastro do time (em UNIDADES) continua sendo a fonte das METAS e dos
 * indicadores de cada pessoa; isto decide apenas QUEM aparece. Separar as duas
 * coisas é o que permite alguém sair do painel sem perder a definição dos
 * indicadores dela — e voltar depois, com o histórico inteiro, bastando
 * revincular o usuário.
 */
export function unidadeComVinculos(unidade: Unidade, chaves: Iterable<string>): Unidade {
  const permitidas = new Set(chaves);
  return { ...unidade, pessoas: unidade.pessoas.filter((p) => permitidas.has(p.chave)) };
}

export function unidadePorSlug(slug: string | undefined): Unidade | null {
  return UNIDADES.find((u) => u.slug === slug) ?? null;
}
