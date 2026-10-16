-- Histórico de lançamentos e fechamento de mês do Painel de Indicadores.
--
-- Até aqui indicadores_valores guardava UM valor por (unidade, mês, tipo,
-- chave). O updated_by/updated_at só conta o último toque: se alguém
-- sobrescreve o número de outra pessoa, o valor anterior some sem rastro, e o
-- "Limpar realizados do mês" apaga tudo sem volta. Estas duas tabelas resolvem
-- isso sem mexer no modelo de leitura — indicadores_valores continua sendo a
-- fonte do painel, rápida de ler, e o histórico fica ao lado.

-- Toda alteração vira uma linha aqui, inclusive a que apaga. Append-only: nada
-- no código faz UPDATE nem DELETE nesta tabela.
CREATE TABLE IF NOT EXISTS indicadores_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidade TEXT NOT NULL,
  mes TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('real', 'meta')),
  chave TEXT NOT NULL,
  -- Nulo em valor_antigo = o campo estava vazio (primeiro lançamento);
  -- nulo em valor_novo = o campo foi esvaziado.
  valor_antigo NUMERIC,
  valor_novo NUMERIC,
  acao TEXT NOT NULL CHECK (acao IN ('gravou', 'apagou', 'limpou_mes')),
  alterado_por UUID,
  alterado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS indicadores_historico_unidade_mes_idx
  ON indicadores_historico (unidade, mes, alterado_em DESC);

-- Mês fechado: linha presente = fechado. Reabrir apaga a linha, e o histórico
-- acima é que guarda o rastro de quem fechou e reabriu.
CREATE TABLE IF NOT EXISTS indicadores_fechamento (
  unidade TEXT NOT NULL,
  mes TEXT NOT NULL,
  fechado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  fechado_por UUID,
  PRIMARY KEY (unidade, mes)
);

-- Mesmo motivo de indicadores_valores: o banco é um Postgres cujo schema public
-- pode ser exposto via PostgREST, e estas tabelas guardam desempenho individual.
-- RLS ligado e sem policy nenhuma: só a aplicação, que fala com o banco pelo
-- usuário dono, enxerga as linhas.
ALTER TABLE indicadores_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicadores_fechamento ENABLE ROW LEVEL SECURITY;
