import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Hash de senha (para os usuários criados no painel) e verificação da senha
// única de admin. Usa node:crypto (scrypt) — só roda em API routes (runtime
// Node.js), nunca no middleware. O cookie de sessão em si fica em
// lib/adminSession.ts, que é Edge-safe.

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSessionCookieValue,
  isValidSessionCookieValue,
} from "./adminSession";
