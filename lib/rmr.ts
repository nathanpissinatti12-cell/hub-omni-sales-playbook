// Formato do RMR — o diagnóstico mensal por pessoa.
//
// A estrutura segue a planilha que o time usa como referência (RMR Setembro
// 2026), sem o bloco de 6M, que lá era exemplo: seções encadeadas, em que cada
// uma se alimenta da anterior. O número do
// indicador é o que ancora tudo: o desvio apurado na seção 1 reaparece na 2, na
// 4, na 5 e na 7. Por isso as duas primeiras seções nascem preenchidas pelo
// painel — na planilha elas eram transcritas à mão, e transcrição à mão é onde
// o número começa a divergir de si mesmo.

export type LinhaResultado = {
  indicador: string;
  realizado: string;
  meta: string;
  /** "100,9% da meta; +R$ 14.325" — leitura, não só o número. */
  leitura: string;
};

export type LinhaPriorizacao = {
  indicador: string;
  /** "13 vs 32 (-19)" */
  gap: string;
  /** "59,4%" */
  desvio: string;
};

/** Uma frente do plano de ação. São os 5W2H mais o que a planilha acrescenta. */
export type LinhaPlano = {
  causa: string;
  oQue: string;
  porQue: string;
  quem: string;
  quando: string;
  onde: string;
  como: string;
  quanto: string;
  indicador: string;
  resultado: string;
  status: string;
  prazo: string;
};

export type Rmr = {
  /** A narrativa do ciclo, em uma frase: o que aconteceu e o que se vai apurar. */
  narrativa: string;
  resultado: LinhaResultado[];
  priorizacao: LinhaPriorizacao[];
  /** "Negociações iniciadas — 13 realizadas vs. 32 de meta." */
  problema: string;
  /** Exatamente cinco, na ordem. Vazio no fim é normal: nem todo caso chega ao 5. */
  porques: string[];
  causaRaiz: string;
  acionavel: boolean;
  precisaSuporte: boolean;
  plano: LinhaPlano[];
  pedido: { desvio: string; causa: string; precisa: string; impacto: string };
  mensagem: string;
};

/** Colunas do 5W2H, na ordem da planilha — usada na tela e na exportação. */
export const COLUNAS_PLANO: { chave: keyof LinhaPlano; rotulo: string; largura: number }[] = [
  { chave: "causa", rotulo: "Causa / frente", largura: 26 },
  { chave: "oQue", rotulo: "O quê", largura: 30 },
  { chave: "porQue", rotulo: "Por quê", largura: 30 },
  { chave: "quem", rotulo: "Quem", largura: 18 },
  { chave: "quando", rotulo: "Quando", largura: 16 },
  { chave: "onde", rotulo: "Onde", largura: 18 },
  { chave: "como", rotulo: "Como", largura: 34 },
  { chave: "quanto", rotulo: "Quanto custa", largura: 14 },
  { chave: "indicador", rotulo: "Indicador impactado", largura: 24 },
  { chave: "resultado", rotulo: "Resultado esperado", largura: 32 },
  { chave: "status", rotulo: "Status", largura: 14 },
  { chave: "prazo", rotulo: "Dias / prazo", largura: 14 },
];

export const STATUS_PLANO = ["Não iniciada", "Em andamento", "Concluída", "Cancelada"] as const;

export function linhaPlanoVazia(): LinhaPlano {
  return {
    causa: "",
    oQue: "",
    porQue: "",
    quem: "",
    quando: "",
    onde: "",
    como: "",
    quanto: "",
    indicador: "",
    resultado: "",
    status: "Não iniciada",
    prazo: "",
  };
}

export function rmrVazio(): Rmr {
  return {
    narrativa: "",
    resultado: [],
    priorizacao: [],
    problema: "",
    porques: ["", "", "", "", ""],
    causaRaiz: "",
    acionavel: false,
    precisaSuporte: false,
    plano: [linhaPlanoVazia()],
    pedido: { desvio: "", causa: "", precisa: "", impacto: "" },
    mensagem: "",
  };
}

/**
 * Normaliza o que veio do banco. O conteúdo é JSONB: um documento gravado por
 * uma versão anterior pode não ter um campo que a tela de hoje espera, e um
 * `undefined` chegando num `value` de input faz o React trocar para campo não
 * controlado no meio da digitação. Tudo que falta vira o vazio equivalente.
 */
export function normalizarRmr(bruto: unknown): Rmr {
  const base = rmrVazio();
  if (bruto === null || typeof bruto !== "object") return base;
  const d = bruto as Partial<Rmr>;

  const texto = (v: unknown) => (typeof v === "string" ? v : "");
  const lista = <T,>(v: unknown, mapear: (item: Record<string, unknown>) => T): T[] =>
    Array.isArray(v) ? v.filter((i) => i && typeof i === "object").map((i) => mapear(i as Record<string, unknown>)) : [];

  const porques = Array.isArray(d.porques) ? d.porques.map(texto) : [];
  while (porques.length < 5) porques.push("");

  const plano = lista<LinhaPlano>(d.plano, (i) => {
    const linha = linhaPlanoVazia();
    for (const { chave } of COLUNAS_PLANO) linha[chave] = texto(i[chave]) || linha[chave];
    return linha;
  });

  return {
    narrativa: texto(d.narrativa),
    resultado: lista<LinhaResultado>(d.resultado, (i) => ({
      indicador: texto(i.indicador),
      realizado: texto(i.realizado),
      meta: texto(i.meta),
      leitura: texto(i.leitura),
    })),
    priorizacao: lista<LinhaPriorizacao>(d.priorizacao, (i) => ({
      indicador: texto(i.indicador),
      gap: texto(i.gap),
      desvio: texto(i.desvio),
    })),
    problema: texto(d.problema),
    porques: porques.slice(0, 5),
    causaRaiz: texto(d.causaRaiz),
    acionavel: d.acionavel === true,
    precisaSuporte: d.precisaSuporte === true,
    plano: plano.length > 0 ? plano : [linhaPlanoVazia()],
    pedido: {
      desvio: texto(d.pedido?.desvio),
      causa: texto(d.pedido?.causa),
      precisa: texto(d.pedido?.precisa),
      impacto: texto(d.pedido?.impacto),
    },
    mensagem: texto(d.mensagem),
  };
}

/** Relatório em branco não deve ocupar lugar na lista de "já preenchidos". */
export function rmrVazioDeFato(r: Rmr): boolean {
  return (
    !r.narrativa.trim() &&
    !r.problema.trim() &&
    !r.causaRaiz.trim() &&
    !r.mensagem.trim() &&
    r.porques.every((p) => !p.trim()) &&
    Object.values(r.pedido).every((v) => !v.trim()) &&
    r.plano.every((l) => !l.oQue.trim() && !l.causa.trim())
  );
}
