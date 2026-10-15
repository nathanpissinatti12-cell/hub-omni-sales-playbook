-- Vínculo do usuário com o Painel de Indicadores.
--
-- `unidade` é o slug da unidade que o usuário enxerga (ver UNIDADES em
-- lib/indicadores.ts) e `pessoa_chave` é a linha dele no N5 — a mesma `chave`
-- do time daquela unidade. Os dois valem só para quem NÃO é root: root vê todas
-- as unidades e não é uma pessoa do N5.
--
-- Ficam nulos por padrão de propósito: usuário sem vínculo não vê painel
-- nenhum, em vez de cair numa unidade errada por acidente.

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS unidade TEXT,
  ADD COLUMN IF NOT EXISTS pessoa_chave TEXT;
