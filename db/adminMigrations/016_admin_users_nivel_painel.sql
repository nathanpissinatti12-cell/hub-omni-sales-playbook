-- Nível do usuário DENTRO do Painel de Indicadores, separado do nível de acesso
-- ao sistema.
--
-- Antes, `access_level` fazia os dois papéis: root via tudo no sistema E tudo no
-- painel; qualquer outro nível via só a própria linha. Não havia como
-- representar supervisão — alguém que acompanha o time inteiro sem ver MRR, CAC
-- e concentração de risco. O painel tem uma faixa chamada "N4 Supervisão" e o
-- modelo de acesso não tinha o papel correspondente.
--
-- Agora são dois eixos:
--   access_level  -> o que vê no SISTEMA (dashboard, equipamentos, admin) e se
--                    pode abrir o painel de outras unidades.
--   nivel_painel  -> o que vê DENTRO do painel da unidade dele.
--
--   n3   = painel inteiro: N3, N4 e todas as pessoas. Único que edita meta.
--   n4   = supervisão: N4 e todas as pessoas, sem N3. Lança pelo time.
--   n5   = a própria linha (mais os agregados do N4). Lança só o seu.
--   null = sem acesso ao painel.
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS nivel_painel TEXT
  CHECK (nivel_painel IN ('n3', 'n4', 'n5'));

-- Quem é root hoje já via o painel inteiro: entra como n3 para ninguém perder
-- acesso na virada. Sem isto, os 7 roots atuais abririam o painel e veriam o
-- aviso de "sem acesso" até alguém marcar o nível um por um.
UPDATE admin_users SET nivel_painel = 'n3' WHERE access_level = 'root' AND nivel_painel IS NULL;
