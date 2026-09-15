export const ADMIN_COOKIE_NAME = "bariu_admin_session";

// Uses the Web Crypto API (available in both the Node.js and Edge runtimes)
// so this file can be imported from middleware as well as route handlers.

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET environment variable. See .env.local.example.");
  }
  return secret;
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toHex(signature);
}

/** Deterministic token derived from the secret so we don't need a session store. */
export async function getAdminSessionToken() {
  return hmacSha256Hex(getSecret(), "bariu-admin");
}

function timingSafeStringEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function isValidAdminSessionToken(token: string | undefined) {
  if (!token) return false;
  const expected = await getAdminSessionToken();
  return timingSafeStringEqual(token, expected);
}

export function isCorrectAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("Missing ADMIN_PASSWORD environment variable. See .env.local.example.");
  }
  return timingSafeStringEqual(password, expected);
}
