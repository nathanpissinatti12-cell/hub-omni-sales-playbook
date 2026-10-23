import type { CampaignPerformanceRow } from "@/db/queries";
import {
  custoDaCampanha,
  custoDaCampanhaReal,
  DEEPSEEK_CUSTO_USD_POR_CHAMADA,
  type CustoCampanha,
} from "./custoCampanha";
import { getCustoRealManual } from "./custoRealManual";

/**
 * Decide, pra UMA linha de desempenho, qual custo mostrar. A ordem importa e
 * é sempre a mesma: valor registrado em código (lib/custoRealManual.ts) →
 * valor registrado no banco admin (custo_campanha_real, colado na linha por
 * aplicaCustoReal) → estimativa por empresa. O Gemini entra por fora dessa
 * escada, porque é medido por chamada no próprio baseapollo: se a campanha
 * tem registro em gemini_uso, usa o medido nos três caminhos.
 *
 * Isto vivia copiado na tabela do dashboard, na página de detalhe e na rota de
 * API. As três cópias precisavam mudar juntas a cada campo novo — a de detalhe
 * já tinha ficado pra trás uma vez.
 */
export function custoDaLinha(c: CampaignPerformanceRow): CustoCampanha | null {
  const geminiUsdReal = c.gemini_custo_usd;
  const manual = getCustoRealManual(c.nome);
  if (manual) {
    return custoDaCampanhaReal({
      empresasConsultadas: c.empresas_consultadas,
      creditosApolloReais: manual.creditosApolloReais,
      deepseekUsdReais: manual.deepseekUsdReais ?? c.empresas_consultadas * DEEPSEEK_CUSTO_USD_POR_CHAMADA,
      acertosHunter: c.acertos_hunter,
      conferidoEm: manual.conferidoEm,
      cicloApolloNovo: c.ciclo_apollo_novo,
      geminiUsdReal,
    });
  }
  if (c.custo_real_apollo_creditos != null && c.custo_real_deepseek_usd != null) {
    return custoDaCampanhaReal({
      empresasConsultadas: c.empresas_consultadas,
      creditosApolloReais: c.custo_real_apollo_creditos,
      deepseekUsdReais: c.custo_real_deepseek_usd,
      acertosHunter: c.acertos_hunter,
      conferidoEm: c.custo_real_conferido_em ?? "",
      cicloApolloNovo: c.ciclo_apollo_novo,
      geminiUsdReal,
    });
  }
  if (c.custo_conferido) {
    return custoDaCampanha(c.empresas_consultadas, c.acertos_hunter, c.ciclo_apollo_novo, c.nome, geminiUsdReal);
  }
  return null;
}

/** "23/10/2026 08:31 → 10:19" a partir do início/fim medidos do Gemini. */
export function formataJanela(inicio: string | null, fim: string | null): string | null {
  if (!inicio) return null;
  const [dataI, horaI] = inicio.split(" ");
  const dia = (d: string) => d.split("-").reverse().join("/");
  if (!fim) return `${dia(dataI)}${horaI ? ` ${horaI}` : ""}`;
  const [dataF, horaF] = fim.split(" ");
  if (dataI === dataF) {
    return `${dia(dataI)} ${horaI ?? ""}${horaF ? ` → ${horaF}` : ""}`.trim();
  }
  return `${dia(dataI)} → ${dia(dataF)}`;
}
