import { adminPool } from "./adminClient";

export type Colaborador = {
  id: string;
  nome: string;
  setor: string | null;
  pos_x: number | null;
  pos_y: number | null;
  created_at: string;
  updated_at: string;
};

export type EquipamentoItem = {
  id: string;
  tipo: string;
  descricao: string | null;
  colaborador_id: string | null;
  created_at: string;
  updated_at: string;
};

const COLABORADOR_COLUMNS = "id, nome, setor, pos_x, pos_y, created_at, updated_at";
const ITEM_COLUMNS = "id, tipo, descricao, colaborador_id, created_at, updated_at";

export async function listColaboradores(): Promise<Colaborador[]> {
  const { rows } = await adminPool.query(
    `SELECT ${COLABORADOR_COLUMNS} FROM equip_colaboradores ORDER BY nome ASC`
  );
  return rows;
}

export async function createColaborador(input: {
  nome: string;
  setor: string | null;
  posX: number | null;
  posY: number | null;
}): Promise<Colaborador> {
  const { rows } = await adminPool.query(
    `INSERT INTO equip_colaboradores (nome, setor, pos_x, pos_y)
     VALUES ($1, $2, $3, $4)
     RETURNING ${COLABORADOR_COLUMNS}`,
    [input.nome, input.setor, input.posX, input.posY]
  );
  return rows[0];
}

export async function updateColaborador(
  id: string,
  input: { nome: string; setor: string | null; posX: number | null; posY: number | null }
): Promise<Colaborador | null> {
  const { rows } = await adminPool.query(
    `UPDATE equip_colaboradores
     SET nome = $2, setor = $3, pos_x = $4, pos_y = $5, updated_at = now()
     WHERE id = $1
     RETURNING ${COLABORADOR_COLUMNS}`,
    [id, input.nome, input.setor, input.posX, input.posY]
  );
  return rows[0] ?? null;
}

export async function updateColaboradorPosicao(
  id: string,
  posX: number,
  posY: number
): Promise<Colaborador | null> {
  const { rows } = await adminPool.query(
    `UPDATE equip_colaboradores
     SET pos_x = $2, pos_y = $3, updated_at = now()
     WHERE id = $1
     RETURNING ${COLABORADOR_COLUMNS}`,
    [id, posX, posY]
  );
  return rows[0] ?? null;
}

export async function deleteColaborador(id: string): Promise<void> {
  await adminPool.query(`DELETE FROM equip_colaboradores WHERE id = $1`, [id]);
}

export async function listItens(): Promise<EquipamentoItem[]> {
  const { rows } = await adminPool.query(
    `SELECT ${ITEM_COLUMNS} FROM equip_itens ORDER BY created_at DESC`
  );
  return rows;
}

export async function createItem(input: {
  tipo: string;
  descricao: string | null;
  colaboradorId: string | null;
}): Promise<EquipamentoItem> {
  const { rows } = await adminPool.query(
    `INSERT INTO equip_itens (tipo, descricao, colaborador_id)
     VALUES ($1, $2, $3)
     RETURNING ${ITEM_COLUMNS}`,
    [input.tipo, input.descricao, input.colaboradorId]
  );
  return rows[0];
}

export async function updateItem(
  id: string,
  input: { tipo: string; descricao: string | null; colaboradorId: string | null }
): Promise<EquipamentoItem | null> {
  const { rows } = await adminPool.query(
    `UPDATE equip_itens
     SET tipo = $2, descricao = $3, colaborador_id = $4, updated_at = now()
     WHERE id = $1
     RETURNING ${ITEM_COLUMNS}`,
    [id, input.tipo, input.descricao, input.colaboradorId]
  );
  return rows[0] ?? null;
}

export async function deleteItem(id: string): Promise<void> {
  await adminPool.query(`DELETE FROM equip_itens WHERE id = $1`, [id]);
}
