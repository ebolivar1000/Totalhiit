import { json } from '../_lib/auth';
import type { Ctx } from '../_lib/auth';

const CRM_STATE_KEY = 'crm_state_v1';

interface StoredCrmState {
  version: number;
  updatedAt: string;
  updatedBy: string;
  paises: unknown[];
  alumnas: unknown[];
  ingresos: unknown[];
  egresos: unknown[];
  fichas: Array<Record<string, unknown>>;
  logsAuditoria: unknown[];
  plantillaMsg: string;
}

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  if (!ctx.env.SITE_CONTENT) {
    return json({ ok: false, error: 'Falta el binding SITE_CONTENT (KV).' }, 503);
  }

  const rawText = await ctx.request.text();
  if (rawText.length > 100000) {
    return json({ ok: false, error: 'Ficha demasiado grande.' }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch {
    return json({ ok: false, error: 'JSON inválido.' }, 400);
  }

  if (!body || typeof body !== 'object') {
    return json({ ok: false, error: 'Datos inválidos.' }, 400);
  }

  const ficha = body as Record<string, unknown>;
  if (typeof ficha.id !== 'string' || !ficha.id.trim() || typeof ficha.nombre !== 'string' || !ficha.nombre.trim()) {
    return json({ ok: false, error: 'Faltan campos obligatorios de la ficha.' }, 400);
  }

  const current = (await ctx.env.SITE_CONTENT.get(CRM_STATE_KEY, 'json')) as StoredCrmState | null;
  if (!current || !Array.isArray(current.fichas)) {
    // Si aún no existe el estado del CRM inicializado en KV, devolvemos ok=false sin romper el flujo local
    return json({ ok: false, pendingInit: true }, 202);
  }

  const nextFichas = [
    ficha,
    ...current.fichas.filter((item) => item && item.id !== ficha.id),
  ];

  const nextState: StoredCrmState = {
    ...current,
    fichas: nextFichas,
    version: (current.version ?? 0) + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'registro-alumna',
  };

  await ctx.env.SITE_CONTENT.put(CRM_STATE_KEY, JSON.stringify(nextState));

  return json({ ok: true, version: nextState.version });
};
