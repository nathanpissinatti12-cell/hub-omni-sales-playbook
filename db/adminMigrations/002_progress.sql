-- Rastreio de progresso: quais seções de quais módulos cada usuário já viu.

CREATE TABLE IF NOT EXISTS playbook_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  module_id INT NOT NULL,
  section_id TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id, section_id)
);

CREATE INDEX IF NOT EXISTS playbook_progress_user_idx ON playbook_progress (user_id);
