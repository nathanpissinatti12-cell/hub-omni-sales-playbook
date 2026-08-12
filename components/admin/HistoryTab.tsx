"use client";

import { ACTION_LABELS, type AdminHistoryEntry } from "./adminTypes";

export function HistoryTab({ history, loading }: { history: AdminHistoryEntry[]; loading: boolean }) {
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
          <p className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
            {new Date(entry.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
      ))}
    </div>
  );
}
