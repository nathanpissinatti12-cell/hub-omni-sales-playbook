"use client";

import { useState } from "react";
import type { CustoCampanhaReal } from "@/db/custoCampanhaRealQueries";

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CustoRealForm({
  campanhaId,
  campanhaNome,
  inicial,
}: {
  campanhaId: string;
  campanhaNome: string;
  inicial: CustoCampanhaReal | null;
}) {
  const [apolloCreditos, setApolloCreditos] = useState(inicial?.apollo_creditos_reais ?? "");
  const [deepseekUsd, setDeepseekUsd] = useState(inicial?.deepseek_usd_reais ?? "");
  const [conferidoEm, setConferidoEm] = useState(inicial?.conferido_em?.slice(0, 10) ?? hoje());
  const [observacao, setObservacao] = useState(inicial?.observacao ?? "");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  async function salvar() {
    setSalvando(true);
    setMensagem(null);
    try {
      const res = await fetch("/api/dashboard/campanhas/custo-real", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campanhaId,
          campanhaNome,
          apolloCreditosReais: apolloCreditos,
          deepseekUsdReais: deepseekUsd,
          conferidoEm,
          observacao: observacao || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Falha ao salvar.");
      }
      setMensagem("Salvo — o dashboard já vai mostrar o valor medido pra essa campanha.");
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : "Falha ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function remover() {
    setSalvando(true);
    setMensagem(null);
    try {
      const res = await fetch(`/api/dashboard/campanhas/custo-real?campanhaId=${encodeURIComponent(campanhaId)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao remover.");
      setApolloCreditos("");
      setDeepseekUsd("");
      setObservacao("");
      setMensagem("Removido — volta a mostrar a estimativa até conferir de novo.");
    } catch (e) {
      setMensagem(e instanceof Error ? e.message : "Falha ao remover.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      className="space-y-3 rounded-lg border p-4"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div>
        <h2 className="text-lg font-semibold">Custo real desta campanha</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Confira os painéis de billing do Apollo (Uso de créditos, filtrado pelo dia da campanha) e do
          DeepSeek (Cost, mesmo filtro) e cole os números aqui. Enquanto não conferir, o dashboard mostra
          uma estimativa (~).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Créditos Apollo (reais, do painel)
          <input
            type="number"
            min={0}
            step="1"
            value={apolloCreditos}
            onChange={(e) => setApolloCreditos(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            style={{ borderColor: "var(--border)", background: "var(--background)" }}
          />
        </label>
        <label className="text-sm">
          Custo DeepSeek em USD (reais, do painel)
          <input
            type="number"
            min={0}
            step="0.01"
            value={deepseekUsd}
            onChange={(e) => setDeepseekUsd(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            style={{ borderColor: "var(--border)", background: "var(--background)" }}
          />
        </label>
        <label className="text-sm">
          Data em que conferiu os painéis
          <input
            type="date"
            value={conferidoEm}
            onChange={(e) => setConferidoEm(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            style={{ borderColor: "var(--border)", background: "var(--background)" }}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Observação (opcional)
          <input
            type="text"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            style={{ borderColor: "var(--border)", background: "var(--background)" }}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={salvar}
          disabled={salvando || apolloCreditos === "" || deepseekUsd === ""}
          className="rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          Salvar valor medido
        </button>
        {inicial && (
          <button
            type="button"
            onClick={remover}
            disabled={salvando}
            className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
            style={{ borderColor: "var(--border)" }}
          >
            Remover (voltar pra estimativa)
          </button>
        )}
        {mensagem && (
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            {mensagem}
          </span>
        )}
      </div>
    </div>
  );
}
