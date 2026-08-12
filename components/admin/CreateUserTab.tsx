"use client";

import { useRef, useState } from "react";
import {
  ACCESS_LEVEL_OPTIONS,
  BDR_LEVEL_OPTIONS,
  type AccessLevel,
  type BdrLevel,
} from "./adminTypes";

export function CreateUserTab({ onCreated }: { onCreated: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("bdr");
  const [bdrLevel, setBdrLevel] = useState<BdrLevel>("blue");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setPhotoDataUrl(null);
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
          photoDataUrl,
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
      <div
        className="flex items-center gap-4 rounded-lg border p-4"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border text-2xl"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
          aria-label="Selecionar foto do usuário"
        >
          {photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoDataUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            "📷"
          )}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        <div>
          <p className="text-sm font-medium">Foto do usuário</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Opcional — clique no círculo para selecionar
          </p>
        </div>
      </div>

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
