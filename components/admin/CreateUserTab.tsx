"use client";

import { useState } from "react";
import {
  ACCESS_LEVEL_OPTIONS,
  BDR_LEVEL_OPTIONS,
  type AccessLevel,
  type BdrLevel,
} from "./adminTypes";

export function CreateUserTab({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("bdr");
  const [bdrLevel, setBdrLevel] = useState<BdrLevel>("blue");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setAccessLevel("bdr");
    setBdrLevel("blue");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          accessLevel,
          bdrLevel: accessLevel === "bdr" ? bdrLevel : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Erro ao criar usuário.");
        setStatus("error");
        return;
      }
      resetForm();
      setStatus("idle");
      onCreated();
    } catch {
      setError("Erro de conexão.");
      setStatus("error");
    }
  }

  const selectedAccessDescription = ACCESS_LEVEL_OPTIONS.find((o) => o.value === accessLevel)?.description;
  const selectedBdrDescription = BDR_LEVEL_OPTIONS.find((o) => o.value === bdrLevel)?.description;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Nome
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome completo"
          required
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="novo@email.com"
          required
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Nível de Acesso
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {ACCESS_LEVEL_OPTIONS.map((opt) => {
            const selected = accessLevel === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAccessLevel(opt.value)}
                className="rounded-md border px-3 py-2 text-left"
                style={{
                  borderColor: selected ? "var(--accent)" : "var(--border)",
                  background: selected ? "var(--accent)" : "transparent",
                  color: selected ? "var(--on-accent)" : "var(--text)",
                }}
              >
                <p className="text-sm font-semibold">{opt.label}</p>
                <p className="text-xs" style={{ color: selected ? "var(--on-accent)" : "var(--text-muted)" }}>
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {accessLevel === "bdr" && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Nível BDR
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BDR_LEVEL_OPTIONS.map((opt) => {
              const selected = bdrLevel === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setBdrLevel(opt.value)}
                  className="rounded-md border px-3 py-2 text-left"
                  style={{
                    borderColor: selected ? "var(--accent)" : "var(--border)",
                    background: selected ? "var(--accent)" : "transparent",
                    color: selected ? "var(--on-accent)" : "var(--text)",
                  }}
                >
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className="text-xs" style={{ color: selected ? "var(--on-accent)" : "var(--text-muted)" }}>
                    {opt.description}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {selectedBdrDescription}
          </p>
        </div>
      )}

      {accessLevel !== "bdr" && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {selectedAccessDescription}
        </p>
      )}

      {error && (
        <p className="text-sm" style={{ color: "#e5484d" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full rounded-md px-3 py-2.5 text-sm font-semibold disabled:opacity-50"
        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
      >
        {status === "saving" ? "Criando..." : "Criar Usuário"}
      </button>
    </form>
  );
}
