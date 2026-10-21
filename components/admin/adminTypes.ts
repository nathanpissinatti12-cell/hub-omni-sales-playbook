import type { AccessLevel } from "@/lib/acessoSistema";

export type { AccessLevel };
export type BdrLevel = "blue" | "gold" | "black" | "platinum";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  access_level: AccessLevel;
  bdr_level: BdrLevel | null;
  /** Unidade do Painel de Indicadores que o usuário enxerga (só não-root). */
  unidade: string | null;
  /** Linha dele no N5 daquela unidade. */
  pessoa_chave: string | null;
  /** O que vê DENTRO do Painel de Indicadores — eixo separado do access_level. */
  nivel_painel: "n3" | "n4" | "n5" | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminHistoryEntry = {
  id: string;
  action: string;
  target_user_id: string | null;
  target_user_name: string | null;
  details: string | null;
  created_at: string;
};

export type Suggestion = {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  status: "nova" | "lida" | "arquivada";
  created_at: string;
};

export type ProgressEntry = {
  user_id: string;
  module_id: number;
  section_id: string;
  viewed_at: string;
};

export const ACCESS_LEVEL_OPTIONS: { value: AccessLevel; label: string; description: string }[] = [
  { value: "bdr", label: "BDR", description: "Módulos 01, 02, 06" },
  { value: "closer", label: "Closer", description: "Módulos 01, 03, 04, 05, 06" },
  { value: "root", label: "Root", description: "Administrador: dashboard, admin e todas as unidades" },
  { value: "owner", label: "Owner", description: "Acesso irrestrito, sem depender de vínculo" },
];

export const BDR_LEVEL_OPTIONS: { value: BdrLevel; label: string; description: string }[] = [
  { value: "blue", label: "Blue", description: "Entrada" },
  { value: "gold", label: "Gold", description: "Consistência em resultado" },
  { value: "black", label: "Black", description: "Alta performance sustentada" },
  { value: "platinum", label: "Platinum", description: "Referência técnica e cultural" },
];

export const ACTION_LABELS: Record<string, string> = {
  usuario_criado: "Usuário criado",
  permissao_alterada: "Permissão alterada",
  usuario_desativado: "Usuário desativado",
  usuario_reativado: "Usuário reativado",
  senha_redefinida: "Senha redefinida",
};
