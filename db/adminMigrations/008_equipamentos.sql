-- Controle de Equipamentos: colaboradores posicionados na planta baixa
-- (vista de cima) e os equipamentos atribuídos a cada um.

CREATE TABLE IF NOT EXISTS equip_colaboradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  setor TEXT,
  pos_x DOUBLE PRECISION,
  pos_y DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equip_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  descricao TEXT,
  colaborador_id UUID REFERENCES equip_colaboradores(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS equip_itens_colaborador_id_idx ON equip_itens (colaborador_id);
