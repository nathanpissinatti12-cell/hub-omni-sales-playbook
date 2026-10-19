-- RMR: o diagnóstico mensal de cada pessoa (resultado -> 6M -> 5 porquês ->
-- causa raiz -> plano 5W2H -> pedido de suporte -> mensagem de fechamento).
--
-- O conteúdo vai em JSONB, não em colunas: isto é um DOCUMENTO, não dado que se
-- cruza. O plano de ação tem número variável de linhas, as seções mudam de
-- formato conforme o método evolui, e nada aqui é somado ou filtrado por campo
-- — o painel lê o documento inteiro de uma vez. Normalizar em sete tabelas
-- daria sete JOINs para montar uma tela só, e uma migration a cada campo novo.
--
-- Uma linha por (unidade, mês, pessoa). A pessoa é a chave do N5
-- ('sara', 'gabriel'), a mesma que prefixa os lançamentos em
-- indicadores_valores — assim o relatório e os números falam da mesma pessoa
-- sem tabela de correspondência.
CREATE TABLE IF NOT EXISTS indicadores_rmr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidade TEXT NOT NULL,
  mes TEXT NOT NULL,
  pessoa TEXT NOT NULL,
  conteudo JSONB NOT NULL,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_por UUID,
  UNIQUE (unidade, mes, pessoa)
);

CREATE INDEX IF NOT EXISTS indicadores_rmr_unidade_mes_idx
  ON indicadores_rmr (unidade, mes);

-- RLS ligado e SEM policy, igual às outras tabelas do painel: o banco fica num
-- projeto Supabase e toda tabela no schema public é exposta via PostgREST para
-- quem tiver a anon key, que é pública por natureza. Aqui dentro há diagnóstico
-- de desempenho individual e pedido de suporte — nada que possa vazar por uma
-- chave de navegador. O acesso é só pelo pool do servidor, que não passa por RLS.
ALTER TABLE indicadores_rmr ENABLE ROW LEVEL SECURITY;
