// Custo estimado de uma campanha de prospecção: Apollo + DeepSeek + Hunter.
//
// Nenhum dos três serviços expõe consumo por campanha, e o baseapollo não
// guarda crédito/chamada gasta em lugar nenhum — então tudo aqui é ESTIMADO
// a partir de quantas vezes cada serviço foi de fato chamado, multiplicado
// pelo preço de 1 chamada (valor pago ÷ cota do plano no período).
//
// Empresa bloqueada pelo dedup ("já existe na base") não entra em NENHUMA das
// três contas: o fluxo do n8n confere `empresas` e `leads_sem_contato` ANTES
// de chamar qualquer serviço externo, então essas não custam nada.

function numeroDoAmbiente(chave: string, padrao: number): number {
  const bruto = process.env[chave];
  if (bruto == null || bruto.trim() === "") return padrao;
  // aceita tanto "0.35" quanto "0,35"
  const n = Number(bruto.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : padrao;
}

/** Cotação USD→BRL usada na conversão. Flutua — ajustar de vez em quando. */
export const USD_BRL = numeroDoAmbiente("USD_BRL", 5.13);

// ---- Apollo ----
// Plano mensal informado pelo usuário: US$236, ciclo de 10.060 créditos.
export const APOLLO_PRECO_MENSAL_USD = numeroDoAmbiente("APOLLO_PRECO_MENSAL_USD", 236);
export const APOLLO_CREDITOS_CICLO = numeroDoAmbiente("APOLLO_CREDITOS_CICLO", 10060);
// Créditos gastos, em média, por empresa que chegou a ser consultada — recalibrado
// 2026-09-08 com o consumo real da ICP - Imobiliaria Rib, direto do painel "Uso de
// créditos" do Apollo (944 créditos em 08/09, filtrado por dia e por usuário) ÷ 234
// empresas consultadas = 4,03. Substitui a estimativa anterior (6,95, calibrada na
// ICP - PedBot), que superestimava o custo em quase 2x. Varia com o porte das
// empresas da lista (busca paginada no Apollo) — remedir quando o perfil mudar muito.
export const CREDITOS_POR_EMPRESA = numeroDoAmbiente("APOLLO_CREDITOS_POR_EMPRESA", 4.03);

// ---- DeepSeek (seleciona o decisor — 1 chamada por empresa consultada) ----
// Custo real por chamada, medido 2026-09-08 direto no painel de billing do
// DeepSeek (US$0,15 / 233 chamadas no dia em que a ICP - Imobiliaria Rib
// rodou). Substitui a estimativa anterior (recarga trimestral ÷ volume médio),
// que era só uma aproximação — este é o preço de fato cobrado por chamada.
export const DEEPSEEK_CUSTO_USD_POR_CHAMADA = numeroDoAmbiente("DEEPSEEK_CUSTO_USD_POR_CHAMADA", 0.000644);

// ---- Hunter (finder/verifier — chamado quando Apollo e Gemini não acham e-mail) ----
// Plano Starter, US$49/mês, 2.000 créditos/mês.
//
// O Hunter só cobra crédito quando a busca ACHA um e-mail (Finder = 1 crédito
// + Verifier automático = 0,5 crédito = 1,5 crédito por acerto); tentativa sem
// resultado não é cobrada. Confirmado 2026-09-08 comparando o histórico real
// de créditos do Hunter (4,5 créditos = 3 acertos × 1,5) contra o banco: bate
// exatamente com `count(email_decisor_fonte = 'hunter')` = 3 na campanha
// ICP - Imobiliaria Rib. Por isso a conta usa só os acertos (fonte='hunter'
// gravada em empresas/resultados), não toda vez que o fluxo tentou o Hunter.
export const HUNTER_CREDITOS_POR_ACERTO = numeroDoAmbiente("HUNTER_CREDITOS_POR_ACERTO", 1.5);
export const HUNTER_PRECO_MENSAL_USD = numeroDoAmbiente("HUNTER_PRECO_MENSAL_USD", 49);
export const HUNTER_CREDITOS_CICLO = numeroDoAmbiente("HUNTER_CREDITOS_CICLO", 2000);

function precoUnitarioReais(precoUsd: number, cota: number): number {
  return cota > 0 ? (precoUsd / cota) * USD_BRL : 0;
}

// A fórmula do Hunter só foi conferida contra o consumo real (histórico de
// créditos do próprio Hunter) na ICP - Imobiliaria Rib, em 2026-09-08. Nas
// campanhas anteriores essa validação nunca foi feita, então o número podia
// estar tão errado quanto o bug que acabamos de corrigir (49 tentativas
// contadas em vez de 3 acertos) — melhor não mostrar um custo não conferido
// do que mostrar um errado com aparência de certeza.
//
// O corte é por data — a ICP - Imobiliaria Rib marca o início da
// contabilização, e toda campanha criada a partir dela (inclusive as
// futuras) já entra automaticamente — mas a COMPARAÇÃO é feita em
// `getCampaignPerformance` (db/queries.ts), dentro do próprio Postgres, não
// aqui. `campanhas.criado_em` é "timestamp without time zone" (hora local do
// Brasil sem indicar o fuso); comparar isso contra um número fixo em JS é uma
// armadilha, porque o mesmo valor lido em máquinas com TZ diferente (dev
// local vs. servidor em produção, que roda em UTC) dá timestamps diferentes.
// Foi exatamente esse bug que fez a campanha sumir da coluna Custo em
// produção mesmo com o dado certo no banco. `custo_conferido` já vem pronto
// (boolean) de `getCampaignPerformance` — use-o direto.

export type CustoCampanha = {
  empresasConsultadas: number;
  /** Buscas do Hunter que acharam o e-mail — só essas são cobradas. */
  acertosHunter: number;
  apolloReais: number;
  deepseekReais: number;
  hunterReais: number;
  totalReais: number;
  creditosApollo: number;
  creditosHunter: number;
};

export function custoDaCampanha(empresasConsultadas: number, acertosHunter: number): CustoCampanha {
  const creditosApollo = empresasConsultadas * CREDITOS_POR_EMPRESA;
  const apolloReais = creditosApollo * precoUnitarioReais(APOLLO_PRECO_MENSAL_USD, APOLLO_CREDITOS_CICLO);
  const deepseekReais = empresasConsultadas * DEEPSEEK_CUSTO_USD_POR_CHAMADA * USD_BRL;
  const creditosHunter = acertosHunter * HUNTER_CREDITOS_POR_ACERTO;
  const hunterReais = creditosHunter * precoUnitarioReais(HUNTER_PRECO_MENSAL_USD, HUNTER_CREDITOS_CICLO);
  return {
    empresasConsultadas,
    acertosHunter,
    apolloReais,
    deepseekReais,
    hunterReais,
    totalReais: apolloReais + deepseekReais + hunterReais,
    creditosApollo,
    creditosHunter,
  };
}

export function formataReais(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Texto do tooltip com a memória de cálculo, serviço por serviço. */
export function explicaCusto(c: CustoCampanha): string {
  return [
    `Apollo: ${c.empresasConsultadas} empresas × ${CREDITOS_POR_EMPRESA} créditos = ${Math.round(c.creditosApollo)} créditos ≈ ${formataReais(c.apolloReais)}`,
    `DeepSeek: ${c.empresasConsultadas} chamadas ≈ ${formataReais(c.deepseekReais)}`,
    `Hunter: ${c.acertosHunter} e-mails achados × ${HUNTER_CREDITOS_POR_ACERTO} créditos = ${c.creditosHunter.toFixed(1)} créditos ≈ ${formataReais(c.hunterReais)}`,
    `Total ≈ ${formataReais(c.totalReais)} (cotação US$1 = ${formataReais(USD_BRL)}). Empresas bloqueadas pelo dedup não entram na conta.`,
  ].join(" · ");
}
