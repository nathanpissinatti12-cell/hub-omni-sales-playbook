import { pool } from "./client";
import { normalizeName } from "./queries";

// Custo do Gemini (busca CNPJ) por campanha, vindo da view
// `vw_gemini_custo_campanha` do baseapollo — ver gemini_uso / gemini_preco,
// criadas em 22/10/2026. Diferente do Apollo e do DeepSeek, aqui o gasto é
// MEDIDO por chamada (o fluxo n8n grava uma linha por chamada em gemini_uso),
// então não há estimativa envolvida: é o custo real daquela campanha.
//
// A leitura é `SELECT *` de propósito. A view é mantida fora deste repo (o SQL
// foi entregue pra rodar direto no banco) e já mudou de forma uma vez; listar
// coluna por coluna aqui faria o dashboard inteiro quebrar quando alguém
// acrescentasse ou renomeasse um campo. Pegamos tudo e escolhemos em JS o que
// reconhecemos — coluna extra é ignorada, coluna que falta vira null.
export type GeminiCustoCampanha = {
  custoUsd: number;
  /** Chamadas que voltaram erro (429 etc) — alerta, não custo. */
  falhas: number | null;
  /** Primeira e última chamada do Gemini na campanha = janela em que ela rodou. */
  inicio: string | null;
  fim: string | null;
};

// `inicio`/`fim` da view são `timestamptz`: o pg entrega o instante certo, e
// formatar com os getters locais imprime no fuso do SERVIDOR — que na Vercel é
// UTC. Foi o que aconteceu na estreia: a ICP - SalesF rodou das 08:31 às 10:19
// e a tela mostrou 11:31 → 13:19, exatamente 3h adiantado. O painel é lido por
// um time no Brasil, então a hora é fixada em America/Sao_Paulo em vez de
// depender de onde o processo roda (em dev, na máquina do Brasil, dá o mesmo
// resultado — o bug só aparece em produção).
const FUSO_PAINEL = "America/Sao_Paulo";

const FORMATO_MOMENTO = new Intl.DateTimeFormat("sv-SE", {
  timeZone: FUSO_PAINEL,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formataMomento(valor: unknown): string | null {
  if (valor == null) return null;
  if (typeof valor === "string") return valor;
  if (!(valor instanceof Date) || Number.isNaN(valor.getTime())) return null;
  // o locale "sv-SE" é o truque padrão pra sair em "YYYY-MM-DD HH:MM", que é o
  // formato que formataJanela espera e que ordena como string.
  return FORMATO_MOMENTO.format(valor).replace(" ", " ").replace(",", "");
}

function numeroOuNull(valor: unknown): number | null {
  if (valor == null) return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

/**
 * Devolve o custo do Gemini por campanha, com a chave já normalizada (mesma
 * regra de db/queries.ts: minúsculas, sem espaço), porque o nome da campanha é
 * digitado à mão em cada fluxo do n8n e volta com grafias diferentes.
 *
 * A view pode ter uma linha por campanha+operação; somamos o custo e as falhas
 * e pegamos a janela inteira (menor início, maior fim).
 */
export async function getGeminiCustoPorCampanha(): Promise<Map<string, GeminiCustoCampanha>> {
  let linhas: Record<string, unknown>[];
  try {
    const { rows } = await pool.query(`SELECT * FROM vw_gemini_custo_campanha`);
    linhas = rows;
  } catch (erro) {
    // A view é criada à mão no banco; enquanto não existir (ou se perder a
    // permissão de leitura), o dashboard segue mostrando o resto em vez de
    // devolver erro 500 na página inteira.
    console.warn("vw_gemini_custo_campanha indisponível — custo do Gemini fica de fora:", erro);
    return new Map();
  }

  const porCampanha = new Map<string, GeminiCustoCampanha>();
  for (const linha of linhas) {
    const nome = (linha.campanha ?? linha.campanha_nome ?? "") as string;
    if (!nome) continue;
    const chave = normalizeName(nome);
    const custoUsd = numeroOuNull(linha.custo_usd) ?? 0;
    const falhas = numeroOuNull(linha.falhas);
    const inicio = formataMomento(linha.inicio);
    const fim = formataMomento(linha.fim);

    const atual = porCampanha.get(chave);
    if (!atual) {
      porCampanha.set(chave, { custoUsd, falhas, inicio, fim });
      continue;
    }
    porCampanha.set(chave, {
      custoUsd: atual.custoUsd + custoUsd,
      falhas: atual.falhas == null && falhas == null ? null : (atual.falhas ?? 0) + (falhas ?? 0),
      inicio: menor(atual.inicio, inicio),
      fim: maior(atual.fim, fim),
    });
  }
  return porCampanha;
}

// Os dois formatos ("YYYY-MM-DD HH:MM" e o que vier como texto do banco) são
// ordenáveis como string, então comparar direto basta.
function menor(a: string | null, b: string | null): string | null {
  if (a == null) return b;
  if (b == null) return a;
  return a < b ? a : b;
}

function maior(a: string | null, b: string | null): string | null {
  if (a == null) return b;
  if (b == null) return a;
  return a > b ? a : b;
}
