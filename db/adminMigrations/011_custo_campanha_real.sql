-- Custo REAL por campanha (Apollo + DeepSeek), conferido manualmente contra
-- os painéis de billing dos dois serviços.
--
-- Nem Apollo nem DeepSeek expõem "quanto essa campanha específica gastou" por
-- API — só dá pra ver nos painéis deles, filtrado por dia. A estimativa em
-- lib/custoCampanha.ts (créditos/empresa, USD/chamada) serve pra campanhas
-- ainda não conferidas; quando alguém confere os dois painéis no dia em que
-- a campanha rodou e grava aqui, o dashboard troca a estimativa pelo valor
-- medido pra aquela campanha específica.
--
-- campanha_id referencia campanhas.id do baseapollo, mas SEM foreign key —
-- são bancos diferentes (este é o admin_omni). campanha_nome é só pra
-- conferência visual de quem olhar a tabela direto.

CREATE TABLE IF NOT EXISTS custo_campanha_real (
  campanha_id UUID PRIMARY KEY,
  campanha_nome TEXT NOT NULL,
  apollo_creditos_reais NUMERIC NOT NULL,
  deepseek_usd_reais NUMERIC NOT NULL,
  conferido_em DATE NOT NULL,
  observacao TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

-- RLS ligado e sem policy, mesmo motivo das outras tabelas deste banco: o
-- schema public é exposto via PostgREST pra quem tiver a anon key (pública),
-- e o app conecta direto via ADMIN_DATABASE_URL (bypass de RLS pelo dono),
-- então nada muda pro app — só impede leitura/escrita pela API REST pública.
ALTER TABLE custo_campanha_real ENABLE ROW LEVEL SECURITY;
