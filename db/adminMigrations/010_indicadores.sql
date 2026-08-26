-- Painel de Indicadores N3/N4/N5.
--
-- Modelo chave-valor por mês: cada lançamento é uma linha
-- (mes, tipo, chave) -> valor. Isso evita ter que alterar o schema toda vez
-- que um indicador novo entra ou sai do painel — a definição de quais
-- indicadores existem vive em lib/indicadores.ts, não no banco.
--
--   mes   : '2026-08' (competência do lançamento)
--   tipo  : 'real' (realizado lançado) | 'meta' (override manual da meta)
--   chave : id do indicador. Para N3/N4 é direto ('n3_mrr_out');
--           para N5 vem prefixado pela pessoa ('sara_reun').

CREATE TABLE IF NOT EXISTS indicadores_valores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('real', 'meta')),
  chave TEXT NOT NULL,
  valor NUMERIC,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID,
  UNIQUE (mes, tipo, chave)
);

CREATE INDEX IF NOT EXISTS indicadores_valores_mes_idx ON indicadores_valores (mes);

-- RLS ligado e SEM policy, de propósito.
--
-- O banco fica num projeto Supabase, e toda tabela no schema public é exposta
-- pela API REST (PostgREST) para quem tiver a anon key — que é pública por
-- natureza. Esta tabela guarda metas de MRR/ARR, CAC e desempenho individual
-- nominal, então não pode ser legível por esse caminho.
--
-- Sem nenhuma policy, o PostgREST (papéis anon/authenticated) não lê nem
-- escreve nada. O app continua funcionando normalmente porque não usa a API
-- REST: conecta direto no Postgres via ADMIN_DATABASE_URL, e o dono da tabela
-- faz bypass de RLS. O controle de quem enxerga o painel continua sendo o
-- middleware + a checagem de accessLevel='root' na rota de API.
ALTER TABLE indicadores_valores ENABLE ROW LEVEL SECURITY;
