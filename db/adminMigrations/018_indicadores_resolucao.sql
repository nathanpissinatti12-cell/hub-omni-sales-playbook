-- Resolução da prioridade do mês: o que a pessoa escreve, no próprio painel,
-- sobre como vai resolver o pior indicador dela.
--
-- Pedido em 21/10/2026. É irmão do RMR, não um pedaço dele: o RMR é o ritual de
-- fechamento, com sete seções e plano 5W2H, feito uma vez por mês na reunião;
-- isto é uma linha escrita no meio do mês, olhando o número que está vermelho
-- agora. Guardar dentro do documento do RMR misturaria a anotação corrente com
-- o relatório fechado — e faria o painel reescrever um JSONB inteiro para
-- salvar uma frase.
--
-- Uma linha por (unidade, mês, pessoa), a mesma chave do RMR. O indicador em
-- questão NÃO é gravado: ele é recalculado a cada abertura, porque qual é o
-- pior muda conforme os lançamentos entram. Gravar junto congelaria a prioridade
-- de três semanas atrás ao lado de um texto que fala de outra coisa.
CREATE TABLE IF NOT EXISTS indicadores_resolucao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidade TEXT NOT NULL,
  mes TEXT NOT NULL,
  pessoa TEXT NOT NULL,
  texto TEXT NOT NULL DEFAULT '',
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_por UUID,
  UNIQUE (unidade, mes, pessoa)
);

CREATE INDEX IF NOT EXISTS indicadores_resolucao_unidade_mes_idx
  ON indicadores_resolucao (unidade, mes);

-- RLS ligado e SEM policy, igual às outras tabelas do painel: o banco fica num
-- projeto Supabase, onde toda tabela do schema public é exposta via PostgREST
-- para quem tiver a anon key — que é pública por natureza. Aqui dentro a pessoa
-- escreve sobre a própria dificuldade; não é texto que possa vazar por uma
-- chave de navegador. O acesso é só pelo pool do servidor, que não passa por RLS.
ALTER TABLE indicadores_resolucao ENABLE ROW LEVEL SECURITY;
