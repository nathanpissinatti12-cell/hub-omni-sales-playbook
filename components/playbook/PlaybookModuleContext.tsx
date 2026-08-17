"use client";

import { createContext, useContext, type ReactNode } from "react";

const PlaybookModuleContext = createContext<number | null>(null);

export function PlaybookModuleProvider({ moduleId, children }: { moduleId: number; children: ReactNode }) {
  return <PlaybookModuleContext.Provider value={moduleId}>{children}</PlaybookModuleContext.Provider>;
}

export function usePlaybookModuleId(): number | null {
  return useContext(PlaybookModuleContext);
}
