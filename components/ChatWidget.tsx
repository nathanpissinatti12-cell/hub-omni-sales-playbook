"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) throw new Error("Sem resposta do servidor");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: acc }]);
      }
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Erro ao falar com o assistente. Tente novamente em instantes." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        aria-label={open ? "Fechar assistente" : "Abrir assistente"}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg border shadow-xl"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
            <p className="text-sm font-semibold">Assistente do Playbook</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Tire dúvidas sobre TakeFlow e Onvox
            </p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Pergunte algo como &quot;como responder a objeção de preço do Onvox?&quot; ou
                &quot;quais são as etapas do funil do TakeFlow?&quot;
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className="max-w-[85%] rounded-lg px-3 py-2 text-sm"
                style={
                  m.role === "user"
                    ? { marginLeft: "auto", background: "var(--accent)", color: "var(--on-accent)" }
                    : { background: "var(--background, transparent)", border: "1px solid var(--border)" }
                }
              >
                {m.content || (loading && i === messages.length - 1 ? "..." : "")}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2 border-t p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              disabled={loading}
              className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--border)" }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}
