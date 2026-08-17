-- Remove a foto de perfil do usuário — feature removida a pedido do cliente.

ALTER TABLE admin_users DROP COLUMN IF EXISTS photo_data_url;
