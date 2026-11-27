import { isAuthorized, json } from '../_lib/auth';
import type { Ctx } from '../_lib/auth';

const CRM_STATE_KEY = 'crm_state_v1';
const CRM_PASSWORD_KEY = 'crm_password_v1';
const DEFAULT_CRM_PASSWORD = 'admin2026';

const ALLOWED_CRM_EMAILS = new Set([
  'ebolivar1000@gmail.com',
  'caribialabs@gmail.com',
  'totalhiit1@gmail.com',
]);

interface CrmPayload {
  paises: unknown[];
  alumnas: unknown[];
  ingresos: unknown[];
  egresos: unknown[];
  fichas: unknown[];
  logsAuditoria: unknown[];
  plantillaMsg: string;
}

interface StoredCrmState extends CrmPayload {
  version: number;
  updatedAt: string;
  updatedBy: string;
  deletedFichaIds?: string[];
}

const getStoredPassword = async (ctx: Ctx): Promise<string> => {
  if (!ctx.env.SITE_CONTENT) return DEFAULT_CRM_PASSWORD;
  const raw = await ctx.env.SITE_CONTENT.get(CRM_PASSWORD_KEY, 'text');
  return typeof raw === 'string' && raw.trim() ? raw.trim() : DEFAULT_CRM_PASSWORD;
};

const authorizeCrmRequest = async (
  ctx: Ctx
): Promise<{ ok: true; email: string } | { ok: false; status: number; error: string }> => {
  const emailHeader = (ctx.request.headers.get('x-crm-email') || '').trim().toLowerCase();
  const keyHeader = (ctx.request.headers.get('x-crm-key') || '').trim();

  if (await isAuthorized(ctx)) {
    return {
      ok: true,
      email: ALLOWED_CRM_EMAILS.has(emailHeader) ? emailHeader : 'admin@totalhiit',
    };
  }

  if (!emailHeader || !ALLOWED_CRM_EMAILS.has(emailHeader)) {
    return { ok: false, status: 401, error: 'Correo de administrador no autorizado.' };
  }

  const expectedKey = await getStoredPassword(ctx);
  if (!keyHeader || keyHeader !== expectedKey) {
    return { ok: false, status: 401, error: 'Clave de CRM inválida o sesión vencida.' };
  }

  return { ok: true, email: emailHeader };
};

const isValidCrmPayload = (input: unknown): input is CrmPayload => {
  if (!input || typeof input !== 'object') return false;
  const obj = input as Record<string, unknown>;
  return (
    Array.isArray(obj.paises) &&
    Array.isArray(obj.alumnas) &&
    Array.isArray(obj.ingresos) &&
    Array.isArray(obj.egresos) &&
    Array.isArray(obj.fichas) &&
    Array.isArray(obj.logsAuditoria) &&
    typeof obj.plantillaMsg === 'string'
  );
};

export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  const auth = await authorizeCrmRequest(ctx);
  if (!auth.ok) {
    return json({ ok: false, error: auth.error }, auth.status);
  }

  if (!ctx.env.SITE_CONTENT) {
    return json({ ok: false, error: 'Falta el binding SITE_CONTENT (KV) en Cloudflare.' }, 503);
  }

  const stored = (await ctx.env.SITE_CONTENT.get(CRM_STATE_KEY, 'json')) as StoredCrmState | null;
  const incoming =
    ((await ctx.env.SITE_CONTENT.get('incoming_fichas_v1', 'json')) as Array<Record<string, unknown>>) || [];

  if (!stored) {
    if (incoming.length > 0) {
      return json({
        ok: true,
        state: {
          paises: [],
          alumnas: [],
          ingresos: [],
          egresos: [],
          fichas: incoming,
          logsAuditoria: [],
          plantillaMsg: '',
        },
        version: 1,
      });
    }
    return json({ ok: true, state: null, version: 0 });
  }

  // Merge incoming student registrations excluding explicitly deleted IDs
  const deletedIdSet = new Set<string>(Array.isArray(stored.deletedFichaIds) ? stored.deletedFichaIds : []);
  let newIncomingCount = 0;
  if (incoming.length > 0 && Array.isArray(stored.fichas)) {
    const existingIds = new Set(
      stored.fichas.map((f) => (f && typeof f === 'object' ? (f as Record<string, unknown>).id : null))
    );
    const newRecords = incoming.filter((f) => {
      if (!f || typeof f !== 'object') return false;
      const id = typeof f.id === 'string' ? f.id : '';
      return id && !existingIds.has(id) && !deletedIdSet.has(id);
    });
    newIncomingCount = newRecords.length;
    if (newRecords.length > 0) {
      stored.fichas = [...newRecords, ...stored.fichas];
    }
  }

  const url = new URL(ctx.request.url);
  const sinceRaw = url.searchParams.get('sinceVersion');
  const sinceVersion = sinceRaw !== null ? Number(sinceRaw) : NaN;
  if (Number.isFinite(sinceVersion) && sinceVersion === stored.version && newIncomingCount === 0) {
    return json({
      ok: true,
      unchanged: true,
      version: stored.version,
      updatedAt: stored.updatedAt,
      updatedBy: stored.updatedBy,
    });
  }

  return json({
    ok: true,
    state: stored,
    version: stored.version,
  });
};

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  const auth = await authorizeCrmRequest(ctx);
  if (!auth.ok) {
    return json({ ok: false, error: auth.error }, auth.status);
  }

  if (!ctx.env.SITE_CONTENT) {
    return json({ ok: false, error: 'Falta el binding SITE_CONTENT (KV) en Cloudflare.' }, 503);
  }

  const rawText = await ctx.request.text();
  if (rawText.length > 15 * 1024 * 1024) {
    return json({ ok: false, error: 'El estado del CRM excede el límite permitido.' }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch {
    return json({ ok: false, error: 'JSON inválido.' }, 400);
  }

  if (!body || typeof body !== 'object') {
    return json({ ok: false, error: 'Cuerpo de solicitud inválido.' }, 400);
  }

  const reqObj = body as Record<string, unknown>;

  if (reqObj.action === 'change_password') {
    const newPassword = typeof reqObj.newPassword === 'string' ? reqObj.newPassword.trim() : '';
    if (newPassword.length < 4 || newPassword.length > 64) {
      return json({ ok: false, error: 'La nueva clave debe tener entre 4 y 64 caracteres.' }, 400);
    }
    await ctx.env.SITE_CONTENT.put(CRM_PASSWORD_KEY, newPassword);
    return json({ ok: true });
  }

  if (reqObj.action === 'verify_login') {
    return json({ ok: true, email: auth.email });
  }

  if (!isValidCrmPayload(reqObj.state)) {
    return json({ ok: false, error: 'Estructura de datos del CRM inválida.' }, 400);
  }

  const current = (await ctx.env.SITE_CONTENT.get(CRM_STATE_KEY, 'json')) as StoredCrmState | null;
  const currentVersion = current?.version ?? 0;
  const nextVersion = currentVersion + 1;
  const updatedAt = new Date().toISOString();

  // Track explicitly deleted registration IDs so stale tabs can never resurrect them,
  // while preserving any newly submitted student registrations that this admin tab hasn't seen yet.
  const requestDeletedIds = Array.isArray(reqObj.deletedFichaIds)
    ? reqObj.deletedFichaIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
    : [];
  const deletedIdSet = new Set<string>([
    ...(Array.isArray(current?.deletedFichaIds) ? current.deletedFichaIds : []),
    ...requestDeletedIds,
  ]);

  const incoming =
    ((await ctx.env.SITE_CONTENT.get('incoming_fichas_v1', 'json')) as Array<Record<string, unknown>>) || [];

  const payloadFichas = (reqObj.state.fichas as Array<Record<string, unknown>>).filter((f) => {
    if (!f || typeof f !== 'object') return false;
    const id = typeof f.id === 'string' ? f.id : '';
    return !id || !deletedIdSet.has(id);
  });

  const payloadIds = new Set(
    payloadFichas.map((f) => (f && typeof f === 'object' ? (f as Record<string, unknown>).id : null))
  );

  // Preserve registrations from both current KV state and incoming_fichas_v1 unless explicitly deleted
  const mergedNewFichas: Array<Record<string, unknown>> = [];
  const mergedNewIds = new Set<string>();

  const candidates = [
    ...incoming,
    ...(Array.isArray(current?.fichas) ? (current.fichas as Array<Record<string, unknown>>) : []),
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue;
    const id = typeof candidate.id === 'string' ? candidate.id : '';
    if (!id || deletedIdSet.has(id) || payloadIds.has(id) || mergedNewIds.has(id)) continue;
    mergedNewIds.add(id);
    mergedNewFichas.push(candidate);
  }

  const finalFichas = mergedNewFichas.length > 0 ? [...mergedNewFichas, ...payloadFichas] : payloadFichas;

  const nextState: StoredCrmState = {
    paises: reqObj.state.paises,
    alumnas: reqObj.state.alumnas,
    ingresos: reqObj.state.ingresos,
    egresos: reqObj.state.egresos,
    fichas: finalFichas,
    logsAuditoria: reqObj.state.logsAuditoria,
    plantillaMsg: reqObj.state.plantillaMsg,
    version: nextVersion,
    updatedAt,
    updatedBy: auth.email,
    deletedFichaIds: Array.from(deletedIdSet),
  };

  await ctx.env.SITE_CONTENT.put(CRM_STATE_KEY, JSON.stringify(nextState));

  // Clear incoming_fichas_v1 only for records that are now safely consolidated or deleted
  if (incoming.length > 0) {
    try {
      const consolidatedIds = new Set<string>([
        ...Array.from(deletedIdSet),
        ...finalFichas.map((f) => (typeof f.id === 'string' ? f.id : '')).filter(Boolean),
      ]);
      const remainingIncoming = incoming.filter((f) => {
        const id = f && typeof f === 'object' && typeof f.id === 'string' ? f.id : '';
        return id && !consolidatedIds.has(id);
      });
      await ctx.env.SITE_CONTENT.put('incoming_fichas_v1', JSON.stringify(remainingIncoming));
    } catch {}
  }

  return json({
    ok: true,
    version: nextVersion,
    updatedAt,
    updatedBy: auth.email,
    mergedNewFichas,
  });
};
