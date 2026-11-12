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
 * Fusiona dos estados del CRM conservando registros nuevos de ambos lados
 * para evitar pérdida de transacciones ante ediciones concurrentes o migración inicial.
 */
export const mergeCrmStates = (
  local: CrmStatePayload,
  remote: CrmStatePayload
): CrmStatePayload => {
  const paises = mergeByKey(local.paises, remote.paises, (p) => p.id);
  const alumnas = mergeByKey(local.alumnas, remote.alumnas, (a) => a.codigo);
  const ingresos = mergeByKey(local.ingresos, remote.ingresos, (i) => i.id);
  const egresos = mergeByKey(local.egresos, remote.egresos, (e) => e.id);
  const fichas = mergeByKey(local.fichas, remote.fichas, (f) => f.id);
  const logsAuditoria = mergeByKey(local.logsAuditoria, remote.logsAuditoria, (l) => l.id);

  return {
    paises,
    alumnas,
    ingresos,
    egresos,
    fichas,
    logsAuditoria,
    plantillaMsg: local.plantillaMsg || remote.plantillaMsg,
  };
};

/**
 * Verifica si el estado local contiene registros (alumnas, ingresos, egresos, fichas)
 * que todavía no existen en la nube (útil para migrar los registros previos en localStorage).
 */
export const hasLocalOnlyRecords = (
  local: CrmStatePayload,
  remote: CrmStatePayload
): boolean => {
  const remoteAlumnas = new Set(remote.alumnas.map((a) => a.codigo));
  if (local.alumnas.some((a) => !remoteAlumnas.has(a.codigo))) return true;

  const remoteIngresos = new Set(remote.ingresos.map((i) => i.id));
  if (local.ingresos.some((i) => !remoteIngresos.has(i.id))) return true;

  const remoteEgresos = new Set(remote.egresos.map((e) => e.id));
  if (local.egresos.some((e) => !remoteEgresos.has(e.id))) return true;

  const remoteFichas = new Set(remote.fichas.map((f) => f.id));
  if (local.fichas.some((f) => !remoteFichas.has(f.id))) return true;

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
  baseVersion: number | null,
  state: CrmStatePayload
): Promise<{
  ok: boolean;
  conflict?: boolean;
  version?: number;
  updatedAt?: string;
  updatedBy?: string;
  currentState?: CrmRemoteState | null;
  error?: string;
}> => {
  const res = await fetch('/api/crm', {
    method: 'POST',
    headers: buildHeaders(email, key),
    body: JSON.stringify({ baseVersion, state }),
  });

  const data = (await res.json()) as {
    ok?: boolean;
    conflict?: boolean;
    version?: number;
    updatedAt?: string;
    updatedBy?: string;
    currentState?: CrmRemoteState | null;
    error?: string;
  };

  if (res.status === 409 && data.conflict) {
    return {
      ok: false,
      conflict: true,
      version: data.version,
      currentState: data.currentState ?? null,
      error: data.error,
    };
  }

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
