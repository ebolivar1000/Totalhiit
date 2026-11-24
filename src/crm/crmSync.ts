import type { FichaRegistro } from './tiposFicha';
import type { Alumna, Egreso, Ingreso, Pais, RegistroAuditoria } from './CRMApp';

export interface CrmStatePayload {
  paises: Pais[];
  alumnas: Alumna[];
  ingresos: Ingreso[];
  egresos: Egreso[];
  fichas: FichaRegistro[];
  logsAuditoria: RegistroAuditoria[];
  plantillaMsg: string;
}

export interface CrmRemoteState extends CrmStatePayload {
  version: number;
  updatedAt: string;
  updatedBy: string;
}

const mergeByKey = <T, K extends string | number>(
  primary: T[],
  secondary: T[],
  getKey: (item: T) => K
): T[] => {
  const map = new Map<K, T>();
  for (const item of secondary) {
    if (item) map.set(getKey(item), item);
  }
  for (const item of primary) {
    if (item) map.set(getKey(item), item);
  }
  return Array.from(map.values());
};

/**
 * Fusiona dos estados del CRM:
 * Para 'fichas', incorpora las fichas nuevas que hayan llegado desde el formulario público.
 * Para el resto de entidades (alumnas, ingresos, egresos, países, logs), el estado local del admin
 * es la autoridad definitiva, garantizando que los registros eliminados se mantengan eliminados
 * y los nuevos registros se persistan sin ser revertidos.
 */
export const mergeCrmStates = (
  local: CrmStatePayload,
  remote: CrmStatePayload
): CrmStatePayload => {
  const fichas = mergeByKey(local.fichas, remote.fichas, (f) => f.id);

  return {
    paises: local.paises,
    alumnas: local.alumnas,
    ingresos: local.ingresos,
    egresos: local.egresos,
    fichas,
    logsAuditoria: local.logsAuditoria,
    plantillaMsg: local.plantillaMsg || remote.plantillaMsg,
  };
};

/**
 * Una vez que la base de datos de Cloudflare KV está en producción con el padrón activo,
 * la nube es la única fuente de la verdad para evitar resucitar registros eliminados desde localStorage.
 */
export const hasLocalOnlyRecords = (
  _local: CrmStatePayload,
  _remote: CrmStatePayload
): boolean => {
  return false;
};

const buildHeaders = (email: string, key: string): Record<string, string> => ({
  'Content-Type': 'application/json',
  'x-crm-email': email.trim().toLowerCase(),
  'x-crm-key': key.trim(),
});

export const verifyCrmLoginRemote = async (
  email: string,
  key: string
): Promise<{ ok: boolean; error?: string }> => {
  try {
    const res = await fetch('/api/crm', {
      method: 'POST',
      headers: buildHeaders(email, key),
      body: JSON.stringify({ action: 'verify_login' }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || 'Credenciales inválidas.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
};

export const fetchCrmStateRemote = async (
  email: string,
  key: string,
  sinceVersion?: number
): Promise<{
  ok: boolean;
  unchanged?: boolean;
  version: number;
  state: CrmRemoteState | null;
  error?: string;
}> => {
  const qs = typeof sinceVersion === 'number' ? `?sinceVersion=${sinceVersion}` : '';
  const res = await fetch(`/api/crm${qs}`, {
    method: 'GET',
    headers: buildHeaders(email, key),
    cache: 'no-store',
  });
  const data = (await res.json()) as {
    ok?: boolean;
    unchanged?: boolean;
    version?: number;
    state?: CrmRemoteState | null;
    error?: string;
  };

  if (!res.ok || !data.ok) {
    return {
      ok: false,
      version: 0,
      state: null,
      error: data.error || `Error HTTP ${res.status}`,
    };
  }

  return {
    ok: true,
    unchanged: Boolean(data.unchanged),
    version: data.version ?? 0,
    state: data.state ?? null,
  };
};

export const saveCrmStateRemote = async (
  email: string,
  key: string,
  state: CrmStatePayload,
  baseVersion: number | null = null
): Promise<{
  ok: boolean;
  version?: number;
  updatedAt?: string;
  updatedBy?: string;
  error?: string;
}> => {
  const res = await fetch('/api/crm', {
    method: 'POST',
    headers: buildHeaders(email, key),
    body: JSON.stringify({ baseVersion, state }),
  });

  const data = (await res.json()) as {
    ok?: boolean;
    version?: number;
    updatedAt?: string;
    updatedBy?: string;
    error?: string;
  };

  if (!res.ok || !data.ok) {
    return {
      ok: false,
      error: data.error || `Error HTTP ${res.status}`,
    };
  }

  return {
    ok: true,
    version: data.version,
    updatedAt: data.updatedAt,
    updatedBy: data.updatedBy,
  };
};

export const changeCrmPasswordRemote = async (
  email: string,
  currentKey: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> => {
  const res = await fetch('/api/crm', {
    method: 'POST',
    headers: buildHeaders(email, currentKey),
    body: JSON.stringify({ action: 'change_password', newPassword }),
  });
  const data = (await res.json()) as { ok?: boolean; error?: string };
  if (!res.ok || !data.ok) {
    return { ok: false, error: data.error || 'No se pudo actualizar la clave.' };
  }
  return { ok: true };
};
