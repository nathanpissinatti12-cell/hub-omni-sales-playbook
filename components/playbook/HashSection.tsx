"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePlaybookModuleId, usePlaybookFavorites } from "./PlaybookModuleContext";
import { CONTENT_UPDATES, isRecentUpdate } from "@/lib/contentUpdates";

// Mostra só a seção cujo #hash da URL aponta pra ela (ou pra algo dentro dela,
// como um sub-tópico ou ICP específico) - as demais ficam escondidas. Sem hash
// na URL, só a seção marcada com defaultOpen aparece (a primeira da página).
// Também registra progresso: na primeira vez que a seção fica visível numa
// sessão de navegação, avisa /api/progress pra contar como "vista".
export function HashSection({
  id,
  className,
  defaultOpen,
  children,
}: {
  id: string;
  className?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(!!defaultOpen);
  const moduleId = usePlaybookModuleId();
  const reportedRef = useRef(false);
  const { isFavorite, toggleFavorite } = usePlaybookFavorites();

  useEffect(() => {
    function evaluate() {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) {
        setVisible(!!defaultOpen);
        return;
      }
      if (hash === id) {
        setVisible(true);
        return;
      }
      const target = document.getElementById(hash);
      setVisible(!!(target && ref.current && ref.current.contains(target)));
    }
    evaluate();
    window.addEventListener("hashchange", evaluate);
    return () => window.removeEventListener("hashchange", evaluate);
  }, [id, defaultOpen]);

  useEffect(() => {
    if (!visible || reportedRef.current || moduleId == null) return;
    reportedRef.current = true;
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, sectionId: id }),
    }).catch(() => {});
  }, [visible, moduleId, id]);

  const update = CONTENT_UPDATES.find(
    (u) => u.moduleId === moduleId && u.sectionId === id && isRecentUpdate(u.date)
  );
  const favorited = isFavorite(id);

  return (
    <section id={id} ref={ref} className={className} hidden={!visible}>
      <div className="mb-2 flex items-center justify-between gap-2">
        {update ? (
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: "rgba(255, 212, 0, 0.15)", color: "var(--accent)" }}
            title={update.note}
          >
            ✨ Atualizado em {new Date(`${update.date}T00:00:00`).toLocaleDateString("pt-BR")}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => toggleFavorite(id)}
          className="shrink-0 rounded-md px-2 py-1 text-sm transition-colors hover:brightness-110"
          style={{ color: favorited ? "var(--accent)" : "var(--text-muted)" }}
          aria-pressed={favorited}
          title={favorited ? "Remover dos favoritos" : "Marcar como favorito"}
        >
          {favorited ? "★ Favorito" : "☆ Favoritar"}
        </button>
      </div>
      {children}
    </section>
  );
}
