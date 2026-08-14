"use client";

import { useEffect, useState } from "react";

type SectionLink = { id: string; label: string };

export function SectionNav({ sections }: { sections: SectionLink[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    function evaluate() {
      const hash = window.location.hash.replace(/^#/, "");
      const match = sections.find((s) => s.id === hash);
      setActiveId(match ? match.id : sections[0]?.id ?? "");
    }
    evaluate();
    window.addEventListener("hashchange", evaluate);
    return () => window.removeEventListener("hashchange", evaluate);
  }, [sections]);

  const idx = sections.findIndex((s) => s.id === activeId);
  const prev = idx > 0 ? sections[idx - 1] : null;
  const next = idx >= 0 && idx < sections.length - 1 ? sections[idx + 1] : null;

  const shortLabel = (label: string) => label.replace(/^Seção\s*\d+\s*—\s*/i, "");

  return (
    <div
      className="flex flex-col items-stretch gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderColor: "var(--border)" }}
    >
      {prev ? (
        <a
          href={`#${prev.id}`}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:brightness-110"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        >
          <span aria-hidden>←</span>
          <span className="truncate">{shortLabel(prev.label)}</span>
        </a>
      ) : (
        <span className="hidden sm:block" />
      )}

      <span
        className="order-first text-center text-xs font-medium sm:order-none"
        style={{ color: "var(--text-muted)" }}
      >
        Seção {idx + 1} de {sections.length}
      </span>

      {next ? (
        <a
          href={`#${next.id}`}
          className="flex items-center justify-end gap-2 rounded-lg border px-3 py-2 text-right text-sm font-medium transition-colors hover:brightness-110"
          style={{ borderColor: "var(--accent)", background: "var(--accent)", color: "var(--on-accent)" }}
        >
          <span className="truncate">{shortLabel(next.label)}</span>
          <span aria-hidden>→</span>
        </a>
      ) : (
        <span className="hidden sm:block" />
      )}
    </div>
  );
}
