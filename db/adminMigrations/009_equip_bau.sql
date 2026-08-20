-- Marca um colaborador especial como "baú" de equipamentos de reserva
-- (não é uma pessoa, é um ponto de estoque no mapa).

ALTER TABLE equip_colaboradores
  ADD COLUMN IF NOT EXISTS is_deposito BOOLEAN NOT NULL DEFAULT FALSE;
