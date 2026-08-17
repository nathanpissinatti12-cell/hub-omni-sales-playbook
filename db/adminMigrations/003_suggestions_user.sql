-- Liga sugestão ao usuário logado que enviou (quando enviada autenticado),
-- pra dar pra mostrar "minhas sugestões" no hub do playbook.

ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS suggestions_user_idx ON suggestions (user_id);
