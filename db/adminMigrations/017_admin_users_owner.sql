-- Nível de acesso "owner": o dono do sistema.
--
-- `access_level` aceitava bdr / closer / root. Root é administrador, mas ainda
-- é um papel CONFIGURADO: desde a 016, sem unidade e sem `nivel_painel` ele não
-- abre o Painel de Indicadores (falha fechado, de propósito). Faltava o nível
-- que não depende de configuração nenhuma — quem vê tudo, em todas as
-- unidades, independente de vínculo.
--
-- Ninguém é promovido aqui: o nível passa a existir e é atribuído pessoa a
-- pessoa em /admin → Permissões. Promover automaticamente os 7 roots atuais
-- daria acesso irrestrito a quem ninguém escolheu para isso.
--
-- O CHECK nasceu sem nome explícito na 001, então o Postgres o chamou de
-- admin_users_access_level_check. Dropar antes de recriar mantém esta migration
-- repetível — o runner reaplica todas elas a cada execução.
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_access_level_check;

ALTER TABLE admin_users
  ADD CONSTRAINT admin_users_access_level_check
  CHECK (access_level IN ('bdr', 'closer', 'root', 'owner'));
