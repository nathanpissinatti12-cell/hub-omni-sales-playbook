"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { rotaInicial } from "@/lib/playbookVisivel";

/**
 * Para onde ir depois de entrar. Só caminho interno: o `?next=` chega pela URL,
 * então sem esta checagem bastaria um link com `?next=https://outro.site` para o
 * login legítimo terminar fora do Hub.
 */
function destinoDepoisDoLogin(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : rotaInicial();
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Lê do FORMULÁRIO, não do estado. Senha preenchida pelo gerenciador do
    // navegador nem sempre dispara `onChange`: o campo mostra o texto e o estado
    // continua vazio, e era isso que deixava o botão desabilitado no primeiro
    // clique — ele não fazia nada, a pessoa clicava de novo e aí entrava.
    const dados = new FormData(e.currentTarget);
    const emailEnviado = String(dados.get("email") ?? "").trim();
    const senhaEnviada = String(dados.get("password") ?? "");
    if (!emailEnviado || !senhaEnviada) {
      setError("Informe e-mail e senha.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailEnviado, password: senhaEnviada, remember }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Não foi possível entrar.");
        setLoading(false);
        return;
      }
      // Navegação completa, e não `router.push`: o App Router guarda em cache a
      // versão da rota de destino que ele buscou ANTES do login — que é o
      // redirecionamento de volta para esta tela. O push caía nessa cópia em
      // cache e o `router.refresh()`, que vinha depois, só a limpava para o
      // clique seguinte. Recarregar a página inteira faz o servidor montar o
      // destino já com o cookie de sessão.
      //
      // `loading` fica ligado de propósito: a página está saindo, e desligar
      // devolveria o botão por um instante.
      window.location.assign(destinoDepoisDoLogin(searchParams.get("next")));
    } catch {
      setError("Erro de conexão. Tente novamente.");
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
            Onvox
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
            name="email"
            type="email"
            autoComplete="username"
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
            name="password"
            type="password"
            autoComplete="current-password"
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
          disabled={loading}
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
