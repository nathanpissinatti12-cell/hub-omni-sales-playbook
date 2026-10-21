import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Hash e verificação de senha dos usuários do Hub. Usa node:crypto (scrypt),
// então só roda em API routes (runtime Node.js), nunca no middleware.
//
// A senha única de /admin saiu em 21/10/2026, junto de `verifyAdminPassword` e
// do cookie `admin_session` (lib/adminSession.ts): /admin passou a pedir o
// login individual de um administrador. O cookie de sessão do Hub está em
// lib/siteSession.ts, que é Edge-safe.

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
