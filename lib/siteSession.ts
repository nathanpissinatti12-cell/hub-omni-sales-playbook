// Cookie de sessão assinado, compartilhado por /playbook e /dashboard — todo
// usuário ativo de admin_users pode logar; qual área/módulo ele enxerga
// depois é decidido pelo access_level (ver ROLE_MODULES em middleware.ts).
// Web Crypto only (roda no middleware, Edge Runtime, sem node:crypto), mesmo
// padrão de adminSession.ts. Formato do valor:
// `${issuedAt}.${uid}.${accessLevel}.${signature}` — sem Buffer/base64, já
// que nenhum desses campos contém ".".

const SESSION_COOKIE = "site_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 horas

export type SiteSession = { uid: string; accessLevel: string };

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET ou ADMIN_PASSWORD precisa estar definida (veja .env.example)");
  }
  return secret;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function importHmacKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(value: string): Promise<string> {
  const key = await importHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(signature);
}

export async function createSiteSessionCookieValue(uid: string, accessLevel: string): Promise<string> {
  const issuedAt = Date.now().toString();
  const payload = `${issuedAt}.${uid}.${accessLevel}`;
  return `${payload}.${await sign(payload)}`;
}

export async function readSiteSession(value: string | undefined | null): Promise<SiteSession | null> {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 4) return null;
  const [issuedAt, uid, accessLevel, signature] = parts;
  if (!issuedAt || !uid || !accessLevel || !signature) return null;

  const payload = `${issuedAt}.${uid}.${accessLevel}`;
  const expected = await sign(payload);
  if (expected.length !== signature.length) return null;

  // Comparação em tempo constante sem depender de node:crypto (Edge-safe).
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  if (diff !== 0) return null;

  const ageSeconds = (Date.now() - Number(issuedAt)) / 1000;
  if (!(ageSeconds >= 0 && ageSeconds <= SESSION_MAX_AGE_SECONDS)) return null;

  return { uid, accessLevel };
}

export const SITE_SESSION_COOKIE = SESSION_COOKIE;
export const SITE_SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_SECONDS;
