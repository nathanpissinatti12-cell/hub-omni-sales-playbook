import { adminPool } from "./adminClient";
import { hashPassword } from "@/lib/adminAuth";

export type AccessLevel = "bdr" | "closer" | "root";
export type BdrLevel = "blue" | "gold" | "black" | "platinum";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  photo_data_url: string | null;
  access_level: AccessLevel;
  bdr_level: BdrLevel | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

const USER_COLUMNS = "id, name, email, photo_data_url, access_level, bdr_level, active, created_at, updated_at";

export async function listUsers(): Promise<AdminUser[]> {
  const { rows } = await adminPool.query(
    `SELECT ${USER_COLUMNS} FROM admin_users ORDER BY created_at DESC`
  );
  return rows;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  photoDataUrl: string | null;
  accessLevel: AccessLevel;
  bdrLevel: BdrLevel | null;
}): Promise<AdminUser> {
  const passwordHash = hashPassword(input.password);
  const { rows } = await adminPool.query(
    `INSERT INTO admin_users (name, email, password_hash, photo_data_url, access_level, bdr_level)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${USER_COLUMNS}`,
    [
      input.name,
      input.email,
      passwordHash,
      input.photoDataUrl,
      input.accessLevel,
      input.accessLevel === "bdr" ? input.bdrLevel : null,
    ]
  );
  return rows[0];
}

export async function updateUserAccess(
  id: string,
  input: { accessLevel: AccessLevel; bdrLevel: BdrLevel | null; active: boolean }
): Promise<AdminUser | null> {
  const { rows } = await adminPool.query(
    `UPDATE admin_users
     SET access_level = $2, bdr_level = $3, active = $4, updated_at = now()
     WHERE id = $1
     RETURNING ${USER_COLUMNS}`,
    [id, input.accessLevel, input.accessLevel === "bdr" ? input.bdrLevel : null, input.active]
  );
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<AdminUser | null> {
  const { rows } = await adminPool.query(
    `SELECT ${USER_COLUMNS} FROM admin_users WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function updateUserPassword(id: string, newPassword: string): Promise<boolean> {
  const passwordHash = hashPassword(newPassword);
  const { rowCount } = await adminPool.query(
    `UPDATE admin_users SET password_hash = $2, updated_at = now() WHERE id = $1`,
    [id, passwordHash]
  );
  return (rowCount ?? 0) > 0;
}

export async function getUserForLogin(email: string): Promise<(AdminUser & { password_hash: string }) | null> {
  const { rows } = await adminPool.query(
    `SELECT ${USER_COLUMNS}, password_hash FROM admin_users WHERE lower(email) = lower($1)`,
    [email]
  );
  return rows[0] ?? null;
}

// ---------- Histórico ----------

export type AdminHistoryEntry = {
  id: string;
  action: string;
  target_user_id: string | null;
  target_user_name: string | null;
  details: string | null;
  created_at: string;
};

export async function logAdminAction(input: {
  action: string;
  targetUserId?: string | null;
  targetUserName?: string | null;
  details?: string | null;
}): Promise<void> {
  await adminPool.query(
    `INSERT INTO admin_history (action, target_user_id, target_user_name, details)
     VALUES ($1, $2, $3, $4)`,
    [input.action, input.targetUserId ?? null, input.targetUserName ?? null, input.details ?? null]
  );
}

export async function listHistory(limit = 100): Promise<AdminHistoryEntry[]> {
  const { rows } = await adminPool.query(
    `SELECT id, action, target_user_id, target_user_name, details, created_at
     FROM admin_history
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

// ---------- Sugestões ----------

export type Suggestion = {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  status: "nova" | "lida" | "arquivada";
  created_at: string;
  user_id: string | null;
};

export async function createSuggestion(input: {
  name?: string | null;
  email?: string | null;
  message: string;
  userId?: string | null;
}): Promise<Suggestion> {
  const { rows } = await adminPool.query(
    `INSERT INTO suggestions (name, email, message, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, message, status, created_at, user_id`,
    [input.name ?? null, input.email ?? null, input.message, input.userId ?? null]
  );
  return rows[0];
}

export async function getSuggestionsByUser(userId: string, limit = 5): Promise<Suggestion[]> {
  const { rows } = await adminPool.query(
    `SELECT id, name, email, message, status, created_at, user_id FROM suggestions
     WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return rows;
}

export async function listSuggestions(): Promise<Suggestion[]> {
  const { rows } = await adminPool.query(
    `SELECT id, name, email, message, status, created_at, user_id FROM suggestions ORDER BY created_at DESC`
  );
  return rows;
}

export async function updateSuggestionStatus(
  id: string,
  status: "nova" | "lida" | "arquivada"
): Promise<Suggestion | null> {
  const { rows } = await adminPool.query(
    `UPDATE suggestions SET status = $2 WHERE id = $1
     RETURNING id, name, email, message, status, created_at, user_id`,
    [id, status]
  );
  return rows[0] ?? null;
}

export async function deleteSuggestion(id: string): Promise<boolean> {
  const { rowCount } = await adminPool.query(`DELETE FROM suggestions WHERE id = $1`, [id]);
  return (rowCount ?? 0) > 0;
}

// ---------- Progresso no playbook ----------

export type ProgressEntry = {
  user_id: string;
  module_id: number;
  section_id: string;
  viewed_at: string;
};

export async function recordProgress(userId: string, moduleId: number, sectionId: string): Promise<void> {
  await adminPool.query(
    `INSERT INTO playbook_progress (user_id, module_id, section_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, module_id, section_id) DO UPDATE SET viewed_at = now()`,
    [userId, moduleId, sectionId]
  );
}

export async function getUserProgress(userId: string): Promise<ProgressEntry[]> {
  const { rows } = await adminPool.query(
    `SELECT user_id, module_id, section_id, viewed_at FROM playbook_progress WHERE user_id = $1`,
    [userId]
  );
  return rows;
}

export async function getAllProgress(): Promise<ProgressEntry[]> {
  const { rows } = await adminPool.query(
    `SELECT user_id, module_id, section_id, viewed_at FROM playbook_progress`
  );
  return rows;
}
