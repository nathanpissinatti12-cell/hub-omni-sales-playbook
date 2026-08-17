"use client";

import { useState } from "react";
import {
  ACCESS_LEVEL_OPTIONS,
  BDR_LEVEL_OPTIONS,
  type AccessLevel,
  type BdrLevel,
} from "./adminTypes";

export function CreateUserTab({ onCreated }: { onCreated: () => void }) {
  const [mode, setMode] = useState<"single" | "bulk">("single");

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("single")}
          className="rounded-md border px-3 py-1.5 text-xs font-semibold"
          style={{
            borderColor: mode === "single" ? "var(--accent)" : "var(--border)",
            background: mode === "single" ? "var(--accent)" : "transparent",
            color: mode === "single" ? "var(--on-accent)" : "var(--text)",
          }}
        >
          Um por vez
        </button>
        <button
          type="button"
          onClick={() => setMode("bulk")}
          className="rounded-md border px-3 py-1.5 text-xs font-semibold"
          style={{
            borderColor: mode === "bulk" ? "var(--accent)" : "var(--border)",
            background: mode === "bulk" ? "var(--accent)" : "transparent",
            color: mode === "bulk" ? "var(--on-accent)" : "var(--text)",
          }}
        >
          Em massa
        </button>
      </div>

      {mode === "single" ? <SingleCreateForm onCreated={onCreated} /> : <BulkCreateForm onCreated={onCreated} />}
    </div>
  );
}

function SingleCreateForm({ onCreated }: { onCreated: () => void }) {
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

type BulkRowResult = { email: string; ok: boolean; error?: string };

function BulkCreateForm({ onCreated }: { onCreated: () => void }) {
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BulkRowResult[] | null>(null);

  const parsedRows = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, email, accessLevel, bdrLevel] = line.split(",").map((v) => v.trim());
      return { name, email, accessLevel, bdrLevel };
    });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, users: parsedRows }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Erro ao criar usuários.");
        setStatus("error");
        return;
      }
      setResults(data.results as BulkRowResult[]);
      setStatus("idle");
      onCreated();
    } catch {
      setError("Erro de conexão.");
      setStatus("error");
    }
  }

  const successCount = results?.filter((r) => r.ok).length ?? 0;
  const failCount = results ? results.length - successCount : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Senha padrão (aplicada a todos)
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

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Lista de usuários
        </label>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Um por linha: <code>Nome, email, nível</code> (bdr / closer / root) — para BDR, opcionalmente um 4º
          campo com o nível BDR (blue / gold / black / platinum, padrão blue).
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          required
          placeholder={"João Silva, joao@empresa.com, bdr, gold\nMaria Souza, maria@empresa.com, closer"}
          className="w-full rounded-md border bg-transparent px-3 py-2 font-mono text-xs outline-none"
          style={{ borderColor: "var(--border)" }}
        />
        {parsedRows.length > 0 && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {parsedRows.length} usuário(s) detectado(s) nessa lista.
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm" style={{ color: "#e5484d" }}>
          {error}
        </p>
      )}

      {results && (
        <div className="space-y-1 rounded-md border p-3" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold">
            {successCount} criado(s), {failCount} com erro.
          </p>
          <ul className="space-y-0.5 text-xs">
            {results.map((r, i) => (
              <li key={i} style={{ color: r.ok ? "var(--text-muted)" : "#e5484d" }}>
                {r.ok ? "✓" : "✗"} {r.email}
                {r.error ? ` — ${r.error}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "saving" || parsedRows.length === 0}
        className="w-full rounded-md px-3 py-2.5 text-sm font-semibold disabled:opacity-50"
        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
      >
        {status === "saving" ? "Criando..." : `Criar ${parsedRows.length || ""} usuário(s)`}
      </button>
    </form>
  );
}
