"use client";

import { useState } from "react";

export function SuggestionWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || undefined, message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setMessage("");
      setName("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (status === "sent") setStatus("idle");
        }}
        className="fixed bottom-5 right-24 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        aria-label={open ? "Fechar sugestões" : "Enviar sugestão"}
      >
        💡
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-24 z-50 w-[20rem] max-w-[calc(100vw-2.5rem)] rounded-lg border p-4 shadow-xl"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p className="text-sm font-semibold">Enviar sugestão</p>
          <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Sua opinião ajuda a melhorar o playbook.
          </p>

          {status === "sent" ? (
            <p className="mt-4 text-sm" style={{ color: "var(--accent)" }}>
              Obrigado! Sua sugestão foi enviada.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-3 space-y-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome (opcional)"
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Sua sugestão..."
                rows={4}
                required
                className="w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
              {status === "error" && (
                <p className="text-xs" style={{ color: "#e5484d" }}>
                  Erro ao enviar. Tente novamente.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending" || !message.trim()}
                className="w-full rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50"
                style={{ background: "var(--accent)", color: "var(--on-accent)" }}
              >
                {status === "sending" ? "Enviando..." : "Enviar"}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
