"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const PlaybookModuleContext = createContext<number | null>(null);

type FavoritesContextValue = {
  isFavorite: (sectionId: string) => boolean;
  toggleFavorite: (sectionId: string) => void;
};

const PlaybookFavoritesContext = createContext<FavoritesContextValue>({
  isFavorite: () => false,
  toggleFavorite: () => {},
});

export function PlaybookModuleProvider({ moduleId, children }: { moduleId: number; children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/favorites")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { module_id: number; section_id: string }[]) => {
        setFavorites(new Set(rows.filter((r) => r.module_id === moduleId).map((r) => r.section_id)));
      })
      .catch(() => {});
  }, [moduleId]);

  const isFavorite = useCallback((sectionId: string) => favorites.has(sectionId), [favorites]);

  const toggleFavorite = useCallback(
    (sectionId: string) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(sectionId)) next.delete(sectionId);
        else next.add(sectionId);
        return next;
      });
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, sectionId }),
      }).catch(() => {});
    },
    [moduleId]
  );

  return (
    <PlaybookModuleContext.Provider value={moduleId}>
      <PlaybookFavoritesContext.Provider value={{ isFavorite, toggleFavorite }}>
        {children}
      </PlaybookFavoritesContext.Provider>
    </PlaybookModuleContext.Provider>
  );
}

export function usePlaybookModuleId(): number | null {
  return useContext(PlaybookModuleContext);
}

export function usePlaybookFavorites(): FavoritesContextValue {
  return useContext(PlaybookFavoritesContext);
}
