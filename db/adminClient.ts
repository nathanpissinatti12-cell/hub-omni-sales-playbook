import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _adminPgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.ADMIN_DATABASE_URL;
  if (!connectionString) {
    throw new Error("ADMIN_DATABASE_URL não está definida (veja .env.example)");
  }
  return new Pool({ connectionString });
}

function getPool() {
  if (!global._adminPgPool) {
    global._adminPgPool = createPool();
  }
  return global._adminPgPool;
}

export const adminPool = {
  query: (text: string, params?: unknown[]) => getPool().query(text, params),
  end: () => getPool().end(),
};
