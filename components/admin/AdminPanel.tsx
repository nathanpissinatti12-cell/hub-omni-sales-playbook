"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateUserTab } from "./CreateUserTab";
import { PermissionsTab } from "./PermissionsTab";
import { SuggestionsTab } from "./SuggestionsTab";
import { HistoryTab } from "./HistoryTab";
import { ProgressTab } from "./ProgressTab";
import type { AdminHistoryEntry, AdminUser, ProgressEntry, Suggestion } from "./adminTypes";

const TABS = [
  { id: "criar", label: "Criar Usuário" },
  { id: "permissoes", label: "Permissões" },
  { id: "progresso", label: "Progresso" },
  { id: "sugestoes", label: "Sugestões" },
  { id: "historico", label: "Histórico" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("criar");

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [history, setHistory] = useState<AdminHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadSuggestions = useCallback(async () => {
    setSuggestionsLoading(true);
    try {
      const res = await fetch("/api/admin/suggestions");
      if (res.ok) setSuggestions(await res.json());
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/admin/history");
      if (res.ok) setHistory(await res.json());
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const loadProgress = useCallback(async () => {
    setProgressLoading(true);
    try {
      const res = await fetch("/api/admin/progress");
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress ?? []);
      }
    } finally {
      setProgressLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadSuggestions();
    loadHistory();
    loadProgress();
  }, [loadUsers, loadSuggestions, loadHistory, loadProgress]);

  function refreshAfterChange() {
    loadUsers();
    loadHistory();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Painel Administrativo</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md border px-3 py-1.5 text-xs font-semibold"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          Sair
        </button>
      </div>

      <div className="mt-6 flex gap-1 border-b" style={{ borderColor: "var(--border)" }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="px-4 py-2 text-sm font-semibold"
              style={{
                color: active ? "var(--accent)" : "var(--text-muted)",
                borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "criar" && <CreateUserTab onCreated={refreshAfterChange} />}
        {tab === "permissoes" && (
          <PermissionsTab users={users} loading={usersLoading} onChanged={refreshAfterChange} />
        )}
        {tab === "progresso" && (
          <ProgressTab users={users} progress={progress} loading={usersLoading || progressLoading} />
        )}
        {tab === "sugestoes" && (
          <SuggestionsTab suggestions={suggestions} loading={suggestionsLoading} onChanged={loadSuggestions} />
        )}
        {tab === "historico" && (
          <HistoryTab history={history} loading={historyLoading} onChanged={loadHistory} />
        )}
      </div>
    </div>
  );
}
