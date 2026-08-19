export type Colaborador = {
  id: string;
  nome: string;
  setor: string | null;
  pos_x: number | null;
  pos_y: number | null;
  created_at: string;
  updated_at: string;
};

export type EquipamentoItem = {
  id: string;
  tipo: string;
  descricao: string | null;
  colaborador_id: string | null;
  created_at: string;
  updated_at: string;
};
