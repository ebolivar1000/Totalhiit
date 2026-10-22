// Utilidades compartidas por las Functions de Cloudflare Pages.
// Se compilan con esbuild (sin dependencias); los tipos son locales a propósito.

export interface KV {
  get(key: string, type?: 'text' | 'json'): Promise<unknown>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface Env {
  SITE_CONTENT?: KV;
  ADMIN_USER?: string;
  ADMIN_PASSWORD_HASH?: string;
  SESSION_SECRET?: string;
}

export interface Ctx {
  request: Request;
  env: Env;
}

export const COOKIE_NAME = 'th_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

const encoder = new TextEncoder();

export const json = (
  data: unknown,
  status = 200,
  extra: Record<string, string> = {}
): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extra,
    },
  });

const b64url = (bytes: Uint8Array): string => {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromB64url = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const b = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
};

const hmac = async (secret: string, data: string): Promise<Uint8Array> => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(data)));
};

const safeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

/** hash con formato `pbkdf2$iteraciones$saltB64url$hashB64url` */
export const verifyPassword = async (stored: string, password: string): Promise<boolean> => {
  const [algo, iterRaw, saltB64, hashB64] = stored.split('$');
  if (algo !== 'pbkdf2' || !saltB64 || !hashB64) return false;
  const iterations = Number(iterRaw);
  if (!Number.isFinite(iterations) || iterations < 10000) return false;

  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: fromB64url(saltB64), iterations, hash: 'SHA-256' },
    key,
    256
  );
  const got = new Uint8Array(bits);
  const expected = fromB64url(hashB64);
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got[i] ^ expected[i];
  return diff === 0;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100000;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256
  );
  return `pbkdf2$${iterations}$${b64url(salt)}$${b64url(new Uint8Array(bits))}`;
};

export const readCookie = (request: Request, name: string): string | null => {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
};

export const sessionCookie = (token: string): string =>
  `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;

export const clearSessionCookie = (): string =>
  `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export const createToken = async (secret: string, user: string): Promise<string> => {
  const payload = `${user}.${Date.now() + SESSION_TTL_SECONDS * 1000}`;
  const sig = b64url(await hmac(secret, payload));
  return `${b64url(encoder.encode(payload))}.${sig}`;
};

export const verifyToken = async (secret: string, token: string | null): Promise<boolean> => {
  if (!token) return false;
  const [payloadRaw, sig] = token.split('.');
  if (!payloadRaw || !sig) return false;
  const payload = new TextDecoder().decode(fromB64url(payloadRaw));
  const expected = b64url(await hmac(secret, payload));
  if (!safeEqual(expected, sig)) return false;
  const exp = Number(payload.split('.')[1]);
  return Number.isFinite(exp) && exp > Date.now();
};

export const isAuthorized = async (ctx: Ctx): Promise<boolean> => {
  if (!ctx.env.SESSION_SECRET) return false;
  return verifyToken(ctx.env.SESSION_SECRET, readCookie(ctx.request, COOKIE_NAME));
};

export interface StoredAuth {
  user: string;
  hash: string;
}

export const readStoredAuth = async (env: Env): Promise<StoredAuth | null> => {
  if (!env.SITE_CONTENT) return null;
  const raw = (await env.SITE_CONTENT.get('auth', 'json')) as StoredAuth | null;
  return raw && typeof raw.user === 'string' && typeof raw.hash === 'string' ? raw : null;
};

export const effectiveAuth = async (env: Env): Promise<StoredAuth | null> => {
  const stored = await readStoredAuth(env);
  if (stored) return stored;
  if (env.ADMIN_USER && env.ADMIN_PASSWORD_HASH) {
    return { user: env.ADMIN_USER, hash: env.ADMIN_PASSWORD_HASH };
  }
  return null;
};

/** Límite simple por IP sobre KV: 20 intentos fallidos cada 10 minutos. */
const rateKey = (request: Request): string =>
  `rl:${request.headers.get('CF-Connecting-IP') || 'anon'}`;

export const isRateLimited = async (env: Env, request: Request): Promise<boolean> => {
  if (!env.SITE_CONTENT) return false;
  const current = Number((await env.SITE_CONTENT.get(rateKey(request))) ?? 0);
  return current >= 20;
};

export const recordFailure = async (env: Env, request: Request): Promise<void> => {
  if (!env.SITE_CONTENT) return;
  const key = rateKey(request);
  const current = Number((await env.SITE_CONTENT.get(key)) ?? 0);
  await env.SITE_CONTENT.put(key, String(current + 1), { expirationTtl: 600 });
};

export const clearFailures = async (env: Env, request: Request): Promise<void> => {
  if (!env.SITE_CONTENT) return;
  await env.SITE_CONTENT.delete(rateKey(request));
};
