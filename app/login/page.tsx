"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Não foi possível entrar.");
        return;
      }
      router.push(searchParams.get("next") || "/playbook");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border p-6"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Omni Assessoria
          </p>
          <h1 className="mt-1 text-xl font-semibold">Entrar</h1>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Use o e-mail e senha cadastrados pelo administrador.
          </p>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4"
          />
          Lembrar de mim (não pedir login de novo por 30 dias)
        </label>

        {error && (
          <p className="text-sm" style={{ color: "#e5484d" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full rounded-md px-3 py-2 text-sm font-semibold disabled:opacity-50"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
