import { adminPool } from "./adminClient";
import type { NivelPainel, UsuarioPainel } from "@/lib/permissaoIndicadores";
import { hashPassword } from "@/lib/adminAuth";
import type { AccessLevel } from "@/lib/acessoSistema";

// O tipo vive em lib/acessoSistema.ts, junto das regras de quem abre o quê;
// aqui fica o reexport para não quebrar quem já importa de @/db/adminQueries.
export type { AccessLevel };
export type BdrLevel = "blue" | "gold" | "black" | "platinum";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  access_level: AccessLevel;
  bdr_level: BdrLevel | null;
  /** Unidade do Painel de Indicadores que este usuário enxerga. */
  unidade: string | null;
  /** Linha dele no N5 daquela unidade — a `chave` da pessoa. Só no nível n5. */
  pessoa_chave: string | null;
  /** O que vê DENTRO do painel: n3, n4, n5 ou nada. Eixo separado do access_level. */
  nivel_painel: NivelPainel | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

const USER_COLUMNS =
  "id, name, email, access_level, bdr_level, unidade, pessoa_chave, nivel_painel, active, created_at, updated_at";

/**
 * Dados que o Painel de Indicadores precisa pra decidir o que mostrar. Vem do
 * banco a cada requisição, e não do cookie de sessão, porque tirar o acesso de
 * alguém tem que valer na hora — cookie assinado continuaria válido até expirar.
 */
export async function getUsuarioPainel(id: string): Promise<UsuarioPainel | null> {
  const { rows } = await adminPool.query(
    `SELECT access_level, unidade, pessoa_chave, nivel_painel
       FROM admin_users WHERE id = $1 AND active = TRUE`,
    [id]
  );
  if (rows.length === 0) return null;
  return {
    accessLevel: rows[0].access_level,
    unidade: rows[0].unidade,
    pessoaChave: rows[0].pessoa_chave,
    nivelPainel: rows[0].nivel_painel,
  };
}

export async function listUsers(): Promise<AdminUser[]> {
  const { rows } = await adminPool.query(
    `SELECT ${USER_COLUMNS} FROM admin_users ORDER BY created_at DESC`
  );
  return rows;
}

/**
 * O vínculo com o Painel de Indicadores entra já na criação. Antes o usuário
 * nascia sem nada e alguém precisava lembrar de abrir a aba Permissões depois —
 * e enquanto não lembrasse, a pessoa logava e via "você ainda não tem acesso".
 *
 * Mesma regra da edição: `pessoa_chave` vale no n5 (obrigatória) e no n4
 * (opcional, a linha individual do supervisor), e não no n3.
 */
export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  accessLevel: AccessLevel;
  bdrLevel: BdrLevel | null;
  unidade?: string | null;
  pessoaChave?: string | null;
  nivelPainel?: NivelPainel | null;
}): Promise<AdminUser> {
  const passwordHash = hashPassword(input.password);
  const nivelPainel = input.nivelPainel ?? null;
  const { rows } = await adminPool.query(
    `INSERT INTO admin_users (name, email, password_hash, access_level, bdr_level,
                              unidade, pessoa_chave, nivel_painel)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${USER_COLUMNS}`,
    [
      input.name,
      input.email,
      passwordHash,
      input.accessLevel,
      input.accessLevel === "bdr" ? input.bdrLevel : null,
      input.unidade ?? null,
      nivelPainel === "n5" || nivelPainel === "n4" ? input.pessoaChave ?? null : null,
      nivelPainel,
    ]
  );
  return rows[0];
}

export async function updateUserAccess(
  id: string,
  input: {
    accessLevel: AccessLevel;
    bdrLevel: BdrLevel | null;
    active: boolean;
    /** Vínculo com o Painel de Indicadores. Vale para QUALQUER nível de acesso. */
    unidade: string | null;
    pessoaChave: string | null;
    nivelPainel: NivelPainel | null;
  }
): Promise<AdminUser | null> {
  // O vínculo NÃO é mais apagado para root. Antes era dado morto, porque root
  // via tudo; agora os dois eixos são separados — root é o que a pessoa vê no
  // sistema, e unidade + nível do painel é o que ela vê no painel. Apagar aqui
  // tiraria do Head a unidade que ele acabou de escolher.
  //
  // A pessoa fica guardada no n5 e no n4, não no n3: o supervisor também tem
  // linha individual (a Sara é N4 e BDR), e desde que o N5 passou a listar quem
  // tem vínculo, sem isto a única pessoa do time que ela não veria seria ela
  // mesma. No n3 não se guarda: o Head olha a operação inteira e não tem linha
  // nominal — seria vínculo que nada lê.
  const { rows } = await adminPool.query(
    `UPDATE admin_users
     SET access_level = $2, bdr_level = $3, active = $4, unidade = $5, pessoa_chave = $6,
         nivel_painel = $7, updated_at = now()
     WHERE id = $1
     RETURNING ${USER_COLUMNS}`,
    [
      id,
      input.accessLevel,
      input.accessLevel === "bdr" ? input.bdrLevel : null,
      input.active,
      input.unidade,
      input.nivelPainel === "n5" || input.nivelPainel === "n4" ? input.pessoaChave : null,
      input.nivelPainel,
    ]
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

export async function deleteHistoryEntry(id: string): Promise<boolean> {
  const { rowCount } = await adminPool.query(`DELETE FROM admin_history WHERE id = $1`, [id]);
  return (rowCount ?? 0) > 0;
}

export async function clearHistory(): Promise<void> {
  await adminPool.query(`DELETE FROM admin_history`);
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

// ---------- Favoritos ----------

export type FavoriteEntry = {
  module_id: number;
  section_id: string;
  created_at: string;
};

export async function getUserFavorites(userId: string): Promise<FavoriteEntry[]> {
  const { rows } = await adminPool.query(
    `SELECT module_id, section_id, created_at FROM playbook_favorites
     WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

export async function toggleFavorite(userId: string, moduleId: number, sectionId: string): Promise<boolean> {
  const { rowCount } = await adminPool.query(
    `DELETE FROM playbook_favorites WHERE user_id = $1 AND module_id = $2 AND section_id = $3`,
    [userId, moduleId, sectionId]
  );
  if ((rowCount ?? 0) > 0) return false;
  await adminPool.query(
    `INSERT INTO playbook_favorites (user_id, module_id, section_id) VALUES ($1, $2, $3)`,
    [userId, moduleId, sectionId]
  );
  return true;
}

// ---------- Pesquisa de empresa ----------

export type CompanyLookup = {
  domain: string | null;
  cnpj: string | null;
  registry_data: Record<string, unknown> | null;
  summary: string | null;
  site_fetch_ok: boolean;
  created_at: string;
};

export async function getCompanyLookup(domain: string): Promise<CompanyLookup | null> {
  const { rows } = await adminPool.query(
    `SELECT domain, cnpj, registry_data, summary, site_fetch_ok, created_at
     FROM company_lookups WHERE domain = $1`,
    [domain]
  );
  return rows[0] ?? null;
}

export async function getCompanyLookupByCnpj(cnpj: string): Promise<CompanyLookup | null> {
  const { rows } = await adminPool.query(
    `SELECT domain, cnpj, registry_data, summary, site_fetch_ok, created_at
     FROM company_lookups WHERE cnpj = $1 ORDER BY created_at DESC LIMIT 1`,
    [cnpj]
  );
  return rows[0] ?? null;
}

export async function saveCompanyLookup(input: {
  domain: string | null;
  cnpj: string | null;
  registryData: Record<string, unknown> | null;
  summary: string | null;
  siteFetchOk: boolean;
  lookedUpBy: string;
}): Promise<CompanyLookup> {
  const { rows } = await adminPool.query(
    `INSERT INTO company_lookups (domain, cnpj, registry_data, summary, site_fetch_ok, looked_up_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (domain) DO UPDATE SET
       cnpj = EXCLUDED.cnpj,
       registry_data = EXCLUDED.registry_data,
       summary = EXCLUDED.summary,
       site_fetch_ok = EXCLUDED.site_fetch_ok,
       looked_up_by = EXCLUDED.looked_up_by,
       created_at = now()
     RETURNING domain, cnpj, registry_data, summary, site_fetch_ok, created_at`,
    [
      input.domain,
      input.cnpj,
      input.registryData ? JSON.stringify(input.registryData) : null,
      input.summary,
      input.siteFetchOk,
      input.lookedUpBy,
    ]
  );
  return rows[0];
}

/**
 * Exclusão definitiva de um usuário. Diferente de desativar, que é o caminho
 * normal: desativado some do login mas mantém histórico, progresso e favoritos.
 *
 * O que o banco faz junto (definido nas FKs, não aqui): progresso e favoritos
 * do playbook são apagados em cascata; histórico do /admin, sugestões e
 * consultas de CNPJ ficam, com a referência virando nula — o registro de "quem
 * fez" vira anônimo em vez de desaparecer.
 *
 * O que NÃO tem FK e portanto sobrevive apontando para um id que não existe
 * mais: `atualizado_por` do RMR e `fechado_por` do fechamento de mês. A
 * consulta usa LEFT JOIN, então nesses lugares o nome passa a aparecer vazio em
 * vez de quebrar — o lançamento em si continua lá, que é o que importa.
 */
export async function deleteUser(id: string): Promise<AdminUser | null> {
  const { rows } = await adminPool.query(
    `DELETE FROM admin_users WHERE id = $1 RETURNING ${USER_COLUMNS}`,
    [id]
  );
  return rows[0] ?? null;
}

/**
 * Quantos administradores ativos existem. Serve para uma pergunta só: impedir
 * que o último seja excluído ou desativado, que trancaria o /admin para todo
 * mundo, sem ninguém que possa reabrir.
 */
export async function contarAdministradoresAtivos(): Promise<number> {
  const { rows } = await adminPool.query(
    `SELECT COUNT(*)::int AS total FROM admin_users
      WHERE active = TRUE AND access_level IN ('root', 'owner')`
  );
  return rows[0]?.total ?? 0;
}

/**
 * Chaves de pessoa vinculadas a usuários ATIVOS daquela unidade — é o que
 * define quem aparece no N5 do painel, decidido em 21/10/2026: "quem deve
 * aparecer no N5 são as pessoas atreladas ao N5".
 *
 * Vale para qualquer nível, não só n5. O caso que obrigou isso é o do
 * supervisor: a Sara é N4 (vê o time todo) e também tem linha individual de BDR
 * — se só o nível n5 contasse, a única pessoa do time que ela não veria seria
 * ela mesma.
 *
 * Usuário desativado não conta: tirar o acesso de alguém não deve ser o que
 * apaga a linha dele do painel, mas também não faz sentido manter no N5 quem
 * saiu da empresa — por isso `active`.
 */
export async function pessoasVinculadas(unidade: string): Promise<string[]> {
  const { rows } = await adminPool.query(
    `SELECT DISTINCT pessoa_chave FROM admin_users
      WHERE active = TRUE AND unidade = $1 AND pessoa_chave IS NOT NULL`,
    [unidade]
  );
  return rows.map((r) => r.pessoa_chave as string);
}
