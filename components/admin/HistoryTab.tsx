"use client";

import { useState } from "react";
import { ACTION_LABELS, type AdminHistoryEntry } from "./adminTypes";

export function HistoryTab({
  history,
  loading,
  onChanged,
}: {
  history: AdminHistoryEntry[];
  loading: boolean;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleDeleteEntry(id: string) {
    if (!confirm("Excluir este registro do histórico? Essa ação não pode ser desfeita.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/history/${id}`, { method: "DELETE" });
      if (res.ok) onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function handleClearAll() {
    if (!confirm("Excluir TODO o histórico de ações? Essa ação não pode ser desfeita.")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/history", { method: "DELETE" });
      if (res.ok) onChanged();
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm" style={{ color: "var(--text-muted)" }}>Carregando histórico...</p>;
  }

  if (history.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Nenhuma ação registrada ainda. Ações como criar usuário ou alterar permissões aparecem
        aqui.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          type="button"
          disabled={busy}
          onClick={handleClearAll}
          className="rounded-md border px-3 py-1 text-xs font-semibold disabled:opacity-50"
          style={{ borderColor: "#e5484d", color: "#e5484d" }}
        >
          Limpar tudo
        </button>
      </div>
      <div className="space-y-2">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-wrap items-start justify-between gap-2 rounded-lg border p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <p className="text-sm font-medium">
                {ACTION_LABELS[entry.action] || entry.action}
                {entry.target_user_name && (
                  <span style={{ color: "var(--text-muted)" }}> · {entry.target_user_name}</span>
                )}
              </p>
              {entry.details && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {entry.details}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(entry.created_at).toLocaleString("pt-BR")}
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleDeleteEntry(entry.id)}
                className="rounded-md border px-2 py-1 text-xs font-semibold disabled:opacity-50"
                style={{ borderColor: "#e5484d", color: "#e5484d" }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
