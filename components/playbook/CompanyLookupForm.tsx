"use client";

import { useState } from "react";

type LookupResult = {
  domain: string | null;
  cnpj: string | null;
  registry_data: Record<string, unknown> | null;
  summary: string | null;
  site_fetch_ok: boolean;
  cached: boolean;
};

const REGISTRY_LABELS: Record<string, string> = {
  razao_social: "Razão social",
  nome_fantasia: "Nome fantasia",
  cnae_fiscal_descricao: "Atividade principal",
  porte: "Porte",
  descricao_situacao_cadastral: "Situação",
  data_inicio_atividade: "Início de atividade",
  municipio: "Município",
  uf: "UF",
  ddd_telefone_1: "Telefone",
};

function formatCnpj(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

export function CompanyLookupForm() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/company-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: query.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Erro ao pesquisar essa empresa.");
        return;
      }
      setResult(data as LookupResult);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const title = result?.domain ?? (result?.cnpj ? formatCnpj(result.cnpj) : "");

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row" autoComplete="off">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="dominio-da-empresa.com.br ou CNPJ"
          required
          autoComplete="off"
          className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          {loading ? "Pesquisando..." : "Pesquisar"}
        </button>
      </form>

      {error && (
        <p className="text-sm" style={{ color: "#e5484d" }}>
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-4 rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">{title}</p>
            {result.cached && (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                resultado em cache
              </span>
            )}
          </div>

          {result.summary && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                Resumo pra ligação
              </p>
              <p className="whitespace-pre-line text-sm">{result.summary}</p>
            </div>
          )}

          {result.registry_data ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                Dados oficiais (Receita Federal)
              </p>
              <dl className="grid gap-1 text-sm sm:grid-cols-2">
                {Object.entries(REGISTRY_LABELS).map(([key, label]) => {
                  const value = result.registry_data?.[key];
                  if (!value) return null;
                  return (
                    <div key={key} className="flex justify-between gap-2 border-b py-1" style={{ borderColor: "var(--border)" }}>
                      <dt style={{ color: "var(--text-muted)" }}>{label}</dt>
                      <dd className="text-right">{String(value)}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ) : (
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Não encontramos um CNPJ público no site dessa empresa, então não foi possível buscar os dados
              oficiais da Receita Federal automaticamente.
            </p>
          )}

          {!result.summary && !result.registry_data && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Não conseguimos coletar informações — confirme se o dado está correto ou tente novamente mais
              tarde.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
