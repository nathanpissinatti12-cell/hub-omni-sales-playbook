"use client";

import { useEffect, useState } from "react";
import {
  ACCESS_LEVEL_OPTIONS,
  BDR_LEVEL_OPTIONS,
  type AccessLevel,
  type AdminUser,
  type BdrLevel,
} from "./adminTypes";

export function PermissionsTab({
  users,
  loading,
  onChanged,
}: {
  users: AdminUser[];
  loading: boolean;
  onChanged: () => void;
}) {
  if (loading) {
    return <p className="text-sm" style={{ color: "var(--text-muted)" }}>Carregando usuários...</p>;
  }

  if (users.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Nenhum usuário criado ainda. Use a aba &quot;Criar Usuário&quot; para adicionar o primeiro.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <UserRow key={user.id} user={user} onChanged={onChanged} />
      ))}
    </div>
  );
}

function UserRow({ user, onChanged }: { user: AdminUser; onChanged: () => void }) {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(user.access_level);
  const [bdrLevel, setBdrLevel] = useState<BdrLevel>(user.bdr_level ?? "blue");
  const [active, setActive] = useState(user.active);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  async function savePassword() {
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPasswordError(data.error || "Não foi possível trocar a senha.");
        return;
      }
      setPasswordSuccess(true);
      setNewPassword("");
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess(false);
      }, 1500);
    } finally {
      setPasswordSaving(false);
    }
  }

  useEffect(() => {
    setDirty(
      accessLevel !== user.access_level ||
        (accessLevel === "bdr" && bdrLevel !== (user.bdr_level ?? "blue")) ||
        active !== user.active
    );
  }, [accessLevel, bdrLevel, active, user]);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessLevel, bdrLevel: accessLevel === "bdr" ? bdrLevel : null, active }),
      });
      if (res.ok) onChanged();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="rounded-lg border p-4"
      style={{ borderColor: "var(--border)", opacity: active ? 1 : 0.6 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border text-sm"
            style={{ borderColor: "var(--border)", background: "var(--bg)" }}
          >
            {user.photo_data_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photo_data_url} alt="" className="h-full w-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActive((v) => !v)}
          className="rounded-md border px-3 py-1 text-xs font-semibold"
          style={{
            borderColor: active ? "var(--border)" : "#e5484d",
            color: active ? "var(--text-muted)" : "#e5484d",
          }}
        >
          {active ? "Ativo" : "Desativado"}
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {ACCESS_LEVEL_OPTIONS.map((opt) => {
          const selected = accessLevel === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAccessLevel(opt.value)}
              className="rounded-md border px-2 py-1.5 text-left text-xs"
              style={{
                borderColor: selected ? "var(--accent)" : "var(--border)",
                background: selected ? "var(--accent)" : "transparent",
                color: selected ? "var(--on-accent)" : "var(--text)",
              }}
            >
              <span className="font-semibold">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {accessLevel === "bdr" && (
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BDR_LEVEL_OPTIONS.map((opt) => {
            const selected = bdrLevel === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setBdrLevel(opt.value)}
                className="rounded-md border px-2 py-1.5 text-left text-xs"
                style={{
                  borderColor: selected ? "var(--accent)" : "var(--border)",
                  background: selected ? "var(--accent)" : "transparent",
                  color: selected ? "var(--on-accent)" : "var(--text)",
                }}
              >
                <span className="font-semibold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {dirty && (
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setShowPasswordForm((v) => !v);
            setPasswordError(null);
            setPasswordSuccess(false);
            setNewPassword("");
          }}
          className="rounded-md border px-3 py-1.5 text-xs font-semibold"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        >
          {showPasswordForm ? "Cancelar" : "Trocar senha"}
        </button>
      </div>

      {showPasswordForm && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nova senha (mín. 6 caracteres)"
            className="min-w-0 flex-1 rounded-md border bg-transparent px-2 py-1.5 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          />
          <button
            type="button"
            onClick={savePassword}
            disabled={passwordSaving || newPassword.length < 6}
            className="rounded-md px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {passwordSaving ? "Salvando..." : "Definir nova senha"}
          </button>
          {passwordError && (
            <p className="w-full text-xs" style={{ color: "#e5484d" }}>
              {passwordError}
            </p>
          )}
          {passwordSuccess && (
            <p className="w-full text-xs" style={{ color: "#22c55e" }}>
              Senha atualizada.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
