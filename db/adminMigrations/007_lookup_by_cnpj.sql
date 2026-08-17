-- Permite pesquisar empresa por CNPJ direto (sem domínio conhecido) — o
-- domínio deixa de ser obrigatório quando a busca partiu do CNPJ.

ALTER TABLE company_lookups ALTER COLUMN domain DROP NOT NULL;
CREATE INDEX IF NOT EXISTS company_lookups_cnpj_idx ON company_lookups (cnpj);
