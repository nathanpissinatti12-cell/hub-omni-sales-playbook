-- Favoritos: vendedor marca uma seção do playbook pra achar rápido antes de
-- uma call, sem depender da busca toda vez.

CREATE TABLE IF NOT EXISTS playbook_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  module_id INT NOT NULL,
  section_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id, section_id)
);

CREATE INDEX IF NOT EXISTS playbook_favorites_user_idx ON playbook_favorites (user_id);
