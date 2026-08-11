import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL não está definida (veja .env.example)");
  }
  return new Pool({ connectionString });
}

function getPool() {
  if (!global._pgPool) {
    global._pgPool = createPool();
  }
  return global._pgPool;
}

export const pool = {
  query: (text: string, params?: unknown[]) => getPool().query(text, params),
  end: () => getPool().end(),
};
