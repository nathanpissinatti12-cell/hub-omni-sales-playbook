// Quais módulos do playbook cada cargo enxerga — mesmo mapeamento mostrado
// na tela "Criar Usuário" do /admin. Compartilhado entre middleware.ts
// (bloqueio real de rota) e PlaybookSidebar.tsx (esconder/desabilitar no menu).
export const ROLE_MODULES: Record<string, number[] | "all"> = {
  bdr: [1, 2, 6],
  closer: [1, 3, 4, 5, 6],
  root: "all",
};

export function allowedModules(accessLevel: string): number[] | "all" {
  return ROLE_MODULES[accessLevel] ?? [];
}

export function isModuleAllowed(accessLevel: string, moduleId: number): boolean {
  const allowed = allowedModules(accessLevel);
  return allowed === "all" || allowed.includes(moduleId);
}
