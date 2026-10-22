"use client";

import { useState } from "react";
import {
  ACCESS_LEVEL_OPTIONS,
  BDR_LEVEL_OPTIONS,
  type AccessLevel,
  type BdrLevel,
} from "./adminTypes";
import { UNIDADES, unidadePorSlug } from "@/lib/indicadores";
import { NIVEIS_PAINEL } from "@/lib/permissaoIndicadores";

export function CreateUserTab({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("bdr");
  const [bdrLevel, setBdrLevel] = useState<BdrLevel>("blue");
  // Vínculo com o Painel de Indicadores — eixo separado do nível de acesso.
  const [unidade, setUnidade] = useState("");
  const [nivelPainel, setNivelPainel] = useState("");
  const [pessoaChave, setPessoaChave] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setAccessLevel("bdr");
    setBdrLevel("blue");
    setUnidade("");
    setNivelPainel("");
    setPessoaChave("");
  }

  // Trocar a unidade invalida o que veio dela: o nível sem unidade não é aceito
  // e a pessoa escolhida é do time da unidade anterior.
  function mudarUnidade(valor: string) {
    setUnidade(valor);
    setNivelPainel("");
    setPessoaChave("");
  }

  function mudarNivelPainel(valor: string) {
    setNivelPainel(valor);
    // A linha individual existe no N5 (obrigatória) e no N4 (opcional, a do
    // supervisor). No N3 não há linha nominal, então o que estava escolhido sai.
    if (valor !== "n5" && valor !== "n4") setPessoaChave("");
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
          unidade: unidade || null,
          nivelPainel: nivelPainel || null,
          pessoaChave: nivelPainel === "n5" || nivelPainel === "n4" ? pessoaChave || null : null,
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
    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Nome
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome completo"
          required
          autoComplete="off"
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
          autoComplete="off"
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
          autoComplete="new-password"
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Nível de Acesso
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Painel de Indicadores — eixo separado do nível de acesso acima. Fica
          na criação para o usuário não nascer sem acesso e depender de alguém
          lembrar da aba Permissões: enquanto ninguém lembrava, a pessoa logava
          e via "você ainda não tem acesso".

          Owner não tem este eixo: vê o painel inteiro de todas as unidades. */}
      {accessLevel === "owner" ? (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Owner vê o painel inteiro de todas as unidades, em todos os níveis — não há
          unidade nem nível a escolher.
        </p>
      ) : (
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Painel de Indicadores
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="text-xs">
            <span className="mb-1 block font-semibold" style={{ color: "var(--text-muted)" }}>
              Unidade
            </span>
            <select
              value={unidade}
              onChange={(e) => mudarUnidade(e.target.value)}
              className="w-full rounded-md border px-2 py-2 text-xs"
              style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
            >
              <option value="">Nenhuma</option>
              {UNIDADES.filter((u) => u.pessoas.length > 0).map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs">
            <span className="mb-1 block font-semibold" style={{ color: "var(--text-muted)" }}>
              Nível
            </span>
            <select
              value={nivelPainel}
              onChange={(e) => mudarNivelPainel(e.target.value)}
              disabled={!unidade}
              className="w-full rounded-md border px-2 py-2 text-xs disabled:opacity-50"
              style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
            >
              <option value="">{unidade ? "Sem acesso ao painel" : "Escolha a unidade"}</option>
              {NIVEIS_PAINEL.map((n) => (
                <option key={n.valor} value={n.valor}>
                  {n.rotulo}
                </option>
              ))}
            </select>
          </label>

          {/* Obrigatória no N5, opcional no N4 (a linha individual do
              supervisor). No N3 não existe. */}
          <label className="text-xs">
            <span className="mb-1 block font-semibold" style={{ color: "var(--text-muted)" }}>
              Linha individual no N5
            </span>
            <select
              value={pessoaChave}
              onChange={(e) => setPessoaChave(e.target.value)}
              disabled={nivelPainel !== "n5" && nivelPainel !== "n4"}
              className="w-full rounded-md border px-2 py-2 text-xs disabled:opacity-50"
              style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
            >
              <option value="">
                {nivelPainel === "n5"
                  ? "Escolha a pessoa"
                  : nivelPainel === "n4"
                    ? "Nenhuma (opcional)"
                    : "só no N4 e no N5"}
              </option>
              {(unidadePorSlug(unidade)?.pessoas ?? []).map((p) => (
                <option key={p.chave} value={p.chave}>
                  {p.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {nivelPainel
            ? NIVEIS_PAINEL.find((n) => n.valor === nivelPainel)?.descricao
            : "Sem nível, a pessoa não abre o Painel de Indicadores. Dá para definir depois, na aba Permissões."}
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
