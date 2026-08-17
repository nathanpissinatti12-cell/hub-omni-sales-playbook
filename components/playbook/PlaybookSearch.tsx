"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { allowedModules } from "@/lib/playbookAccess";
import { MODULES } from "@/lib/playbookModule1";

type IndexEntry = {
  moduleId: number;
  sectionId: string;
  sectionLabel: string;
  text: string;
};

const CACHE_KEY = "playbook-search-index-v1";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Busca o HTML real de cada modulo que o usuario pode ver e extrai o texto
// de cada <section id="..."> (renderizada pelo HashSection). Nao duplica
// conteudo em nenhum outro lugar - sempre reflete exatamente o que esta
// escrito nas paginas, mesmo se o conteudo mudar depois.
async function buildIndex(accessLevel: string): Promise<IndexEntry[]> {
  const allowed = allowedModules(accessLevel);
  const modules = MODULES.filter((m) => m.available && m.href && (allowed === "all" || allowed.includes(m.id)));
  const entries: IndexEntry[] = [];

  for (const m of modules) {
    if (!m.href) continue;
    try {
      const res = await fetch(m.href, { credentials: "same-origin" });
      if (!res.ok) continue;
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const sections = doc.querySelectorAll(".playbook-content section[id]");
      sections.forEach((section) => {
        const id = section.getAttribute("id") || "";
        const heading = section.querySelector("h2, h3");
        const label = heading?.textContent?.trim() || id;
        const text = (section.textContent || "").replace(/\s+/g, " ").trim();
        if (text) entries.push({ moduleId: m.id, sectionId: id, sectionLabel: label, text });
      });
    } catch {
      // falha de rede num modulo nao deve derrubar a busca inteira
    }
  }

  return entries;
}

export function PlaybookSearch({ accessLevel }: { accessLevel: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  async function ensureIndex() {
    if (index) return;
    setLoading(true);
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        setIndex(JSON.parse(cached));
        return;
      }
      const built = await buildIndex(accessLevel);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(built));
      setIndex(built);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!index || query.trim().length < 2) return [];
    const q = normalize(query);
    return index
      .map((entry) => {
        const hay = normalize(`${entry.sectionLabel} ${entry.text}`);
        const idx = hay.indexOf(q);
        if (idx === -1) return null;
        const start = Math.max(0, idx - 40);
        const snippet = (idx > 40 ? "…" : "") + entry.text.slice(start, idx + q.length + 60) + "…";
        return { ...entry, snippet };
      })
      .filter((r): r is IndexEntry & { snippet: string } => r !== null)
      .slice(0, 8);
  }, [index, query]);

  function goTo(entry: IndexEntry) {
    setOpen(false);
    setQuery("");
    router.push(`/playbook/modulo-${entry.moduleId}#${entry.sectionId}`);
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center gap-2 rounded-md border px-2.5 py-1.5"
        style={{ borderColor: "var(--border)" }}
      >
        <Search size={14} className="shrink-0" style={{ color: "var(--text-muted)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setOpen(true);
            ensureIndex();
          }}
          placeholder="Buscar no playbook..."
          className="w-full bg-transparent text-sm outline-none"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca" className="shrink-0">
            <X size={14} style={{ color: "var(--text-muted)" }} />
          </button>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div
          className="absolute z-20 mt-1 max-h-80 w-full overflow-y-auto rounded-md border shadow-lg"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          {loading && (
            <p className="p-3 text-xs" style={{ color: "var(--text-muted)" }}>
              Carregando índice de busca...
            </p>
          )}
          {!loading && results.length === 0 && (
            <p className="p-3 text-xs" style={{ color: "var(--text-muted)" }}>
              Nada encontrado para &quot;{query}&quot;.
            </p>
          )}
          {!loading &&
            results.map((r) => (
              <button
                key={`${r.moduleId}-${r.sectionId}`}
                type="button"
                onClick={() => goTo(r)}
                className="block w-full border-b px-3 py-2 text-left transition-colors last:border-0 hover:brightness-110"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                  Módulo {r.moduleId} — {r.sectionLabel}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  {r.snippet}
                </p>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
