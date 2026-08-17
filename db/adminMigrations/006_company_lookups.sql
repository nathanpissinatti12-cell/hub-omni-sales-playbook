-- Cache de pesquisas de empresa (dados oficiais da Receita + resumo do site
-- feito por IA), pra vendedor pesquisar um prospect antes de uma call sem
-- depender de fonte paga (Apollo). Uma linha por domínio já pesquisado.

CREATE TABLE IF NOT EXISTS company_lookups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT UNIQUE NOT NULL,
  cnpj TEXT,
  registry_data JSONB,
  summary TEXT,
  site_fetch_ok BOOLEAN NOT NULL DEFAULT false,
  looked_up_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
