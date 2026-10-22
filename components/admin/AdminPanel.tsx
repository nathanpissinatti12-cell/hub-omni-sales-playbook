"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateUserTab } from "./CreateUserTab";
import { PermissionsTab } from "./PermissionsTab";
import { HistoryTab } from "./HistoryTab";
import type { AdminHistoryEntry, AdminUser } from "./adminTypes";

// Progresso e Sugestões ficam fora da lista enquanto o playbook não está em
// uso: as duas vivem do conteúdo dos módulos — uma mostra quem avançou, a
// outra o que os usuários mandaram de dentro deles. Sem playbook, é um
// ranking de zeros e uma caixa vazia.
//
// Só escondidas: ProgressTab.tsx, SuggestionsTab.tsx e as rotas
// /api/admin/progress e /api/admin/suggestions continuam no repo. Para trazer
// de volta, basta a linha da aba, o load e o branch de render.
const TABS = [
  { id: "criar", label: "Criar Usuário" },
  { id: "permissoes", label: "Permissões" },
  { id: "historico", label: "Histórico" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("criar");

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [history, setHistory] = useState<AdminHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } finally {
      setUsersLoading(false);
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

  useEffect(() => {
    loadUsers();
    loadHistory();
  }, [loadUsers, loadHistory]);

  function refreshAfterChange() {
    loadUsers();
    loadHistory();
  }

  // Sair do /admin é sair do Hub: não existe mais sessão separada de admin.
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Onvox
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
        {tab === "historico" && (
          <HistoryTab history={history} loading={historyLoading} onChanged={loadHistory} />
        )}
      </div>
    </div>
  );
}
