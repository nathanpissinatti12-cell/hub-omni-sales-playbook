// Registro manual de atualizações de conteúdo do playbook. Toda vez que uma
// seção já publicada for editada (não seções novas, só edição de conteúdo
// existente), acrescente uma entrada aqui — isso liga o selo "Atualizado" na
// seção (HashSection.tsx) e a lista "O que mudou" no hub (/playbook).
export type ContentUpdate = {
  moduleId: number;
  sectionId: string;
  date: string; // YYYY-MM-DD
  note: string;
};

export const CONTENT_UPDATES: ContentUpdate[] = [];

const HIGHLIGHT_WINDOW_DAYS = 30;

export function isRecentUpdate(dateStr: string): boolean {
  const ageDays = (Date.now() - new Date(`${dateStr}T00:00:00`).getTime()) / 86_400_000;
  return ageDays >= 0 && ageDays <= HIGHLIGHT_WINDOW_DAYS;
}

export function latestUpdates(limit = 5): ContentUpdate[] {
  return [...CONTENT_UPDATES]
    .filter((u) => isRecentUpdate(u.date))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}
