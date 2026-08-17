"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "omni-playbook-welcome-dismissed";

export function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISSED_KEY)) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="rounded-lg border p-5"
      style={{ borderColor: "var(--accent)", background: "rgba(255, 212, 0, 0.08)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold">👋 Novo por aqui? Conheça o que o playbook oferece</p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold"
          style={{ color: "var(--text-muted)" }}
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
        <li>🔍 <strong style={{ color: "var(--text)" }}>Busca</strong> — procure qualquer script, ICP ou objeção direto na barra lateral.</li>
        <li>★ <strong style={{ color: "var(--text)" }}>Favoritos</strong> — marque as seções que você mais usa pra achar rápido antes de uma call.</li>
        <li>📊 <strong style={{ color: "var(--text)" }}>Progresso</strong> — acompanhe aqui no hub quanto do conteúdo você já viu.</li>
        <li>💬 <strong style={{ color: "var(--text)" }}>Assistente de IA</strong> — tire dúvidas sobre o playbook no botão de chat no canto da tela.</li>
      </ul>
      <button
        type="button"
        onClick={dismiss}
        className="mt-4 rounded-md px-3 py-1.5 text-xs font-semibold"
        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
      >
        Entendi, fechar
      </button>
    </div>
  );
}
