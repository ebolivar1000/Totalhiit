/**
 * Autenticación del panel de administración.
 *
 * En producción (Cloudflare Pages) la clave se valida en el servidor:
 * `POST /api/login` verifica el hash PBKDF2 guardado en KV o en los secretos y
 * devuelve una cookie HttpOnly firmada. En desarrollo (Vite, sin Functions) se
 * usa el hash local de `localStorage` como respaldo.
 */

const CREDS_KEY = 'totalhiit.admin.creds.v1';
const SESSION_KEY = 'totalhiit.admin.session.v1';
const USER_KEY = 'totalhiit.admin.user.v1';

export const DEFAULT_ADMIN_USER = 'admin';
export const DEFAULT_ADMIN_PASSWORD = 'TotalHiit2026!';

export type AuthMode = 'server' | 'local' | 'unknown';

type HashAlgo = 'sha256' | 'fnv1a';

interface StoredCreds {
  user: string;
  passHash: string;
  algo: HashAlgo;
}

let mode: AuthMode = 'unknown';
let lastError: string | null = null;

export const getAuthMode = (): AuthMode => mode;
export const getAuthError = (): string | null => lastError;

/** Solo en dev local tiene sentido caer al hash del navegador. */
const canUseLocalFallback = (): boolean =>
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1', '[::1]', ''].includes(window.location.hostname);

const isJson = (res: Response): boolean =>
  (res.headers.get('Content-Type') || '').includes('application/json');

const fnv1aHash = (value: string): string => {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < value.length; i++) {
    const ch = value.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
};

export const hashPassword = async (
  password: string,
  algo?: HashAlgo
): Promise<{ hash: string; algo: HashAlgo }> => {
  const chosen: HashAlgo =
    algo ?? (window.isSecureContext && window.crypto?.subtle ? 'sha256' : 'fnv1a');

  if (chosen === 'sha256' && window.crypto?.subtle) {
    const data = new TextEncoder().encode(`totalhiit::${password}`);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const hash = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
    return { hash, algo: 'sha256' };
  }

  return { hash: fnv1aHash(`totalhiit::${password}`), algo: 'fnv1a' };
};

const readCreds = (): StoredCreds | null => {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCreds;
    return parsed?.user && parsed?.passHash ? parsed : null;
  } catch {
    return null;
  }
};

export const hasCustomCredentials = (): boolean => readCreds() !== null;

export const isLoggedIn = (): boolean => sessionStorage.getItem(SESSION_KEY) === '1';

export const getAdminUser = (): string =>
  localStorage.getItem(USER_KEY) ?? readCreds()?.user ?? DEFAULT_ADMIN_USER;

const localLogin = async (user: string, password: string): Promise<boolean> => {
  const stored = readCreds();

  if (!stored) {
    const ok =
      user.trim().toLowerCase() === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASSWORD;
    if (!ok) return false;
    const { hash, algo } = await hashPassword(password);
    localStorage.setItem(
      CREDS_KEY,
      JSON.stringify({ user: DEFAULT_ADMIN_USER, passHash: hash, algo } satisfies StoredCreds)
    );
    sessionStorage.setItem(SESSION_KEY, '1');
    return true;
  }

  if (user.trim().toLowerCase() !== stored.user.toLowerCase()) return false;
  const { hash } = await hashPassword(password, stored.algo);
  if (hash !== stored.passHash) return false;
  sessionStorage.setItem(SESSION_KEY, '1');
  return true;
};

export const login = async (user: string, password: string): Promise<boolean> => {
  lastError = null;
  let res: Response | null = null;

  try {
    res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ user: user.trim(), password }),
    });
  } catch {
    res = null;
  }

  const hasServer = res !== null && isJson(res) && res.status !== 404 && res.status !== 405;

  if (hasServer && res) {
    mode = 'server';
    if (res.ok) {
      sessionStorage.setItem(SESSION_KEY, '1');
      localStorage.setItem(USER_KEY, user.trim().toLowerCase());
      return true;
    }
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    lastError = data?.error ?? 'Usuario o clave incorrectos.';
    return false;
  }

  if (!canUseLocalFallback()) {
    mode = 'server';
    lastError = 'No se pudo conectar con el servidor del panel.';
    return false;
  }

  mode = 'local';
  const ok = await localLogin(user, password);
  if (!ok) lastError = 'Usuario o clave incorrectos.';
  return ok;
};

/** Recupera la sesión del servidor (cookie HttpOnly) al abrir el panel. */
export const checkSession = async (): Promise<boolean> => {
  if (isLoggedIn()) {
    if (mode === 'unknown') mode = canUseLocalFallback() ? 'local' : 'server';
    return true;
  }

  try {
    const res = await fetch('/api/session', { credentials: 'same-origin' });
    if (isJson(res) && res.ok) {
      mode = 'server';
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (data?.ok) {
        sessionStorage.setItem(SESSION_KEY, '1');
        return true;
      }
      return false;
    }
  } catch {
    /* sin red o sin backend */
  }

  mode = canUseLocalFallback() ? 'local' : 'server';
  return false;
};

export const logout = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
  if (mode === 'server') {
    fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
  }
};

/** Devuelve el mensaje de error, o null si el cambio fue exitoso. */
export const changePassword = async (current: string, next: string): Promise<string | null> => {
  if (next.length < 8) return 'La nueva clave debe tener al menos 8 caracteres.';
  if (next === current) return 'La nueva clave debe ser distinta de la actual.';

  if (mode === 'server' || !canUseLocalFallback()) {
    try {
      const res = await fetch('/api/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ current, next }),
      });
      if (isJson(res)) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (res.ok) return null;
        return data?.error ?? 'No se pudo actualizar la clave.';
      }
    } catch {
      return 'No se pudo conectar con el servidor.';
    }
    if (!canUseLocalFallback()) return 'No se pudo conectar con el servidor.';
  }

  const stored = readCreds();
  const currentOk = stored
    ? (await hashPassword(current, stored.algo)).hash === stored.passHash
    : current === DEFAULT_ADMIN_PASSWORD;

  if (!currentOk) return 'La clave actual no es correcta.';

  const { hash, algo } = await hashPassword(next);
  localStorage.setItem(
    CREDS_KEY,
    JSON.stringify({ user: stored?.user ?? DEFAULT_ADMIN_USER, passHash: hash, algo } satisfies StoredCreds)
  );
  return null;
};
