// Custo estimado de uma campanha de prospecção.
//
// O Apollo não expõe consumo por campanha, e o baseapollo não guarda crédito
// gasto em lugar nenhum — então o custo aqui é ESTIMADO a partir de duas
// coisas: quantas empresas realmente chegaram a consultar o Apollo, e uma taxa
// média de créditos por empresa.
//
// Empresa bloqueada pelo dedup ("já existe na base") não entra na conta: o
// fluxo do n8n confere `empresas` e `leads_sem_contato` ANTES de chamar o
// Apollo, então essas não custam nada.
//
// A taxa padrão (6,95) foi calibrada na campanha ICP - PedBot, a única com
// consumo medido de verdade: 299 créditos para 43 empresas consultadas (73
// domínios, menos os bloqueados pelo dedup). Ela varia com o tamanho das
// empresas da lista, porque a busca de pessoas no Apollo é paginada e empresa
// grande consome mais páginas. Remedir de tempos em tempos e ajustar aqui.

/** Créditos Apollo gastos, em média, por empresa que chegou a ser consultada. */
export const CREDITOS_POR_EMPRESA = numeroDoAmbiente("APOLLO_CREDITOS_POR_EMPRESA", 6.95);

/**
 * Preço de 1 crédito Apollo em reais (valor do plano ÷ créditos do ciclo).
 * Sem isso configurado não dá para converter em R$, e a coluna mostra "—" em
 * vez de um valor inventado.
 */
export const PRECO_CREDITO_BRL = numeroDoAmbiente("APOLLO_PRECO_CREDITO_BRL", null);

function numeroDoAmbiente(chave: string, padrao: number): number;
function numeroDoAmbiente(chave: string, padrao: null): number | null;
function numeroDoAmbiente(chave: string, padrao: number | null): number | null {
  const bruto = process.env[chave];
  if (bruto == null || bruto.trim() === "") return padrao;
  // aceita tanto "0.35" quanto "0,35"
  const n = Number(bruto.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : padrao;
}

export type CustoCampanha = {
  /** Empresas que efetivamente consultaram o Apollo (as que custaram). */
  empresasConsultadas: number;
  creditos: number;
  /** null quando APOLLO_PRECO_CREDITO_BRL não está configurado. */
  reais: number | null;
};

export function custoDaCampanha(empresasConsultadas: number): CustoCampanha {
  const creditos = empresasConsultadas * CREDITOS_POR_EMPRESA;
  return {
    empresasConsultadas,
    creditos,
    reais: PRECO_CREDITO_BRL == null ? null : creditos * PRECO_CREDITO_BRL,
  };
}

export function formataReais(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Texto do rótulo que explica de onde saiu o número, para tooltip. */
export function explicaCusto(c: CustoCampanha): string {
  const base = `Estimativa: ${c.empresasConsultadas} empresas consultadas × ${CREDITOS_POR_EMPRESA} créditos = ${Math.round(c.creditos)} créditos. Empresas bloqueadas pelo dedup não custam crédito.`;
  return c.reais == null
    ? `${base} Defina APOLLO_PRECO_CREDITO_BRL para ver o valor em reais.`
    : `${base} Convertido a ${formataReais(PRECO_CREDITO_BRL as number)} por crédito.`;
}
