"use client";

import { useState } from "react";
import type { Suggestion } from "./adminTypes";

const STATUS_LABELS: Record<Suggestion["status"], string> = {
  nova: "Nova",
  lida: "Lida",
  arquivada: "Arquivada",
};

export function SuggestionsTab({
  suggestions,
  loading,
  onChanged,
}: {
  suggestions: Suggestion[];
  loading: boolean;
  onChanged: () => void;
}) {
  if (loading) {
    return <p className="text-sm" style={{ color: "var(--text-muted)" }}>Carregando sugestões...</p>;
  }

  if (suggestions.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Nenhuma sugestão recebida ainda. O botão de sugestão fica disponível para quem acessa o
        playbook.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {suggestions.map((s) => (
        <SuggestionRow key={s.id} suggestion={s} onChanged={onChanged} />
      ))}
    </div>
  );
}

function SuggestionRow({ suggestion, onChanged }: { suggestion: Suggestion; onChanged: () => void }) {
  const [updating, setUpdating] = useState(false);

  async function setStatus(status: Suggestion["status"]) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/suggestions/${suggestion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) onChanged();
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div
      className="rounded-lg border p-4"
      style={{ borderColor: "var(--border)", opacity: suggestion.status === "arquivada" ? 0.6 : 1 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{suggestion.name || "Anônimo"}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {new Date(suggestion.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
        <span
          className="rounded px-2 py-0.5 text-xs font-semibold"
          style={{
            background: suggestion.status === "nova" ? "var(--accent)" : "var(--border)",
            color: suggestion.status === "nova" ? "var(--on-accent)" : "var(--text-muted)",
          }}
        >
          {STATUS_LABELS[suggestion.status]}
        </span>
      </div>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
        {suggestion.message}
      </p>
      <div className="mt-3 flex gap-2">
        {suggestion.status !== "lida" && (
          <button
            type="button"
            disabled={updating}
            onClick={() => setStatus("lida")}
            className="rounded-md border px-3 py-1 text-xs font-semibold disabled:opacity-50"
            style={{ borderColor: "var(--border)" }}
          >
            Marcar como lida
          </button>
        )}
        {suggestion.status !== "arquivada" && (
          <button
            type="button"
            disabled={updating}
            onClick={() => setStatus("arquivada")}
            className="rounded-md border px-3 py-1 text-xs font-semibold disabled:opacity-50"
            style={{ borderColor: "var(--border)" }}
          >
            Arquivar
          </button>
        )}
        {suggestion.status === "arquivada" && (
          <button
            type="button"
            disabled={updating}
            onClick={() => setStatus("nova")}
            className="rounded-md border px-3 py-1 text-xs font-semibold disabled:opacity-50"
            style={{ borderColor: "var(--border)" }}
          >
            Reabrir
          </button>
        )}
      </div>
    </div>
  );
}
