-- Painel de Indicadores por unidade da Onvox (Cerquilho, Tatuí, Mkt, Ribeirão).
--
-- Antes desta migration existia um painel só, e todo lançamento em
-- indicadores_valores era dele. Esses lançamentos passam a pertencer a
-- 'cerquilho', que é o painel que já estava em uso — por isso o DEFAULT e o
-- backfill. O slug vive em lib/indicadores.ts (UNIDADES); aqui não há CHECK de
-- valores porque abrir unidade nova não deve exigir migration.
--
-- A chave única ganha a unidade na frente: duas unidades podem lançar o mesmo
-- indicador, no mesmo mês, com valores diferentes, sem colidir.

ALTER TABLE indicadores_valores
  ADD COLUMN IF NOT EXISTS unidade TEXT NOT NULL DEFAULT 'cerquilho';

UPDATE indicadores_valores SET unidade = 'cerquilho' WHERE unidade IS NULL;

ALTER TABLE indicadores_valores DROP CONSTRAINT IF EXISTS indicadores_valores_mes_tipo_chave_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'indicadores_valores_unidade_mes_tipo_chave_key'
  ) THEN
    ALTER TABLE indicadores_valores
      ADD CONSTRAINT indicadores_valores_unidade_mes_tipo_chave_key UNIQUE (unidade, mes, tipo, chave);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS indicadores_valores_unidade_mes_idx ON indicadores_valores (unidade, mes);
