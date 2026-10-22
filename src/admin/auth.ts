/**
 * Autenticación del panel de administración.
 *
 * IMPORTANTE: el sitio es estático (sin backend), así que esta protección es del
 * lado del cliente: sirve para separar el panel del sitio público, no como
 * seguridad real. Ver ai/decisions.md (Decisión 13).
 */

const CREDS_KEY = 'totalhiit.admin.creds.v1';
const SESSION_KEY = 'totalhiit.admin.session.v1';

export const DEFAULT_ADMIN_USER = 'admin';
export const DEFAULT_ADMIN_PASSWORD = 'TotalHiit2026!';

type HashAlgo = 'sha256' | 'fnv1a';

interface StoredCreds {
  user: string;
  passHash: string;
  algo: HashAlgo;
}

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

export const logout = (): void => sessionStorage.removeItem(SESSION_KEY);

export const getAdminUser = (): string => readCreds()?.user ?? DEFAULT_ADMIN_USER;

export const login = async (user: string, password: string): Promise<boolean> => {
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

/** Devuelve el mensaje de error, o null si el cambio fue exitoso. */
export const changePassword = async (current: string, next: string): Promise<string | null> => {
  const stored = readCreds();
  const currentOk = stored
    ? (await hashPassword(current, stored.algo)).hash === stored.passHash
    : current === DEFAULT_ADMIN_PASSWORD;

  if (!currentOk) return 'La clave actual no es correcta.';
  if (next.length < 8) return 'La nueva clave debe tener al menos 8 caracteres.';
  if (next === current) return 'La nueva clave debe ser distinta de la actual.';

  const { hash, algo } = await hashPassword(next);
  localStorage.setItem(
    CREDS_KEY,
    JSON.stringify({ user: stored?.user ?? DEFAULT_ADMIN_USER, passHash: hash, algo } satisfies StoredCreds)
  );
  return null;
};
