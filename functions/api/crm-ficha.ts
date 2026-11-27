import { json } from '../_lib/auth';
import type { Ctx } from '../_lib/auth';

const CRM_STATE_KEY = 'crm_state_v1';
const INCOMING_FICHAS_KEY = 'incoming_fichas_v1';

interface StoredCrmState {
  version: number;
  updatedAt: string;
  updatedBy: string;
  deletedFichaIds?: string[];
  paises: unknown[];
  alumnas: unknown[];
  ingresos: unknown[];
  egresos: unknown[];
  fichas: Array<Record<string, unknown>>;
  logsAuditoria: unknown[];
  plantillaMsg: string;
}

const sendAdminEmailNotification = async (
  endpoint: string,
  payload: Record<string, unknown>,
  timeoutMs = 4500
): Promise<boolean> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://totalhiit.pages.dev',
        Referer: 'https://totalhiit.pages.dev/crm/registro/',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  if (!ctx.env.SITE_CONTENT) {
    return json({ ok: true, fichas: [] });
  }
  const incoming =
    ((await ctx.env.SITE_CONTENT.get(INCOMING_FICHAS_KEY, 'json')) as Array<Record<string, unknown>>) || [];
  return json({ ok: true, fichas: incoming });
};

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

  const rawRecord = body as Record<string, unknown>;
  const skipNotifications = rawRecord.skipNotifications === true;
  const ficha: Record<string, unknown> = { ...rawRecord };
  delete ficha.skipNotifications;

  if (typeof ficha.id !== 'string' || !ficha.id.trim() || typeof ficha.nombre !== 'string' || !ficha.nombre.trim()) {
    return json({ ok: false, error: 'Faltan campos obligatorios de la ficha.' }, 400);
  }

  const recordId = ficha.id.trim();

  // 1. Always persist in incoming_fichas_v1 as a durable intake queue
  const incoming =
    ((await ctx.env.SITE_CONTENT.get(INCOMING_FICHAS_KEY, 'json')) as Array<Record<string, unknown>>) || [];
  const nextIncoming = [
    ficha,
    ...incoming.filter((item) => item && item.id !== recordId),
  ];
  await ctx.env.SITE_CONTENT.put(INCOMING_FICHAS_KEY, JSON.stringify(nextIncoming));

  // 2. Immediately persist into the master CRM state in KV
  const current = (await ctx.env.SITE_CONTENT.get(CRM_STATE_KEY, 'json')) as StoredCrmState | null;
  let nextVersion = 1;
  let alreadyExisted = false;
  if (current && Array.isArray(current.fichas)) {
    alreadyExisted = current.fichas.some((item) => item && item.id === recordId);
    const nextFichas = [
      ficha,
      ...current.fichas.filter((item) => item && item.id !== recordId),
    ];
    const nextDeletedIds = Array.isArray(current.deletedFichaIds)
      ? current.deletedFichaIds.filter((id) => id !== recordId)
      : [];
    nextVersion = (current.version ?? 0) + 1;
    const nextState: StoredCrmState = {
      ...current,
      fichas: nextFichas,
      deletedFichaIds: nextDeletedIds,
      version: nextVersion,
      updatedAt: new Date().toISOString(),
      updatedBy: 'student-registration',
    };
    await ctx.env.SITE_CONTENT.put(CRM_STATE_KEY, JSON.stringify(nextState));
  }

  // 3. Await admin email notifications cleanly so Cloudflare Workers does not kill the request on return
  let emailNotified = false;
  if (!skipNotifications && !alreadyExisted) {
    const studentName = String(ficha.nombre_completo || `${ficha.nombre} ${ficha.apellido || ''}`).trim();
    const studentEmail = String(ficha.email || '').trim();
    const studentPhone = String(ficha.telefono_whatsapp || '').trim();
    const primaryGoal = String(ficha.objetivo_principal || 'No especificado').trim();
    const location = String(ficha.localidad_pais || 'No especificada').trim();

    const emailBody = {
      _captcha: 'false',
      _template: 'table',
      _subject: `🚨 NUEVA ALUMNA REGISTRADA EN TOTALHIIT: ${studentName}`,
      _cc: 'caribialabs@gmail.com',
      _replyto: studentEmail || 'totalhiit1@gmail.com',
      alumna: studentName,
      whatsapp: studentPhone,
      email: studentEmail,
      edad: ficha.edad,
      ubicacion: location,
      objetivo: primaryGoal,
      altura_peso: `${ficha.altura} | ${ficha.peso} (Talla ${ficha.talla_remera})`,
      alergias: ficha.alergias,
      lesiones_patologias: ficha.lesiones_desde_cuando || ficha.problemas_musculares_oseos,
      medicamentos: ficha.medicamentos_detalle || ficha.toma_medicamentos,
      contacto_emergencia: ficha.contacto_emergencia,
      fecha_registro: ficha.fecha_registro,
      link_crm: 'https://totalhiit.pages.dev/crm',
    };

    const results = await Promise.allSettled([
      sendAdminEmailNotification('https://formsubmit.co/ajax/totalhiit1@gmail.com', emailBody),
      sendAdminEmailNotification('https://formsubmit.co/ajax/ebolivar1000@gmail.com', emailBody),
    ]);
    emailNotified = results.some((r) => r.status === 'fulfilled' && r.value === true);
  }

  return json({
    ok: true,
    persisted: true,
    version: nextVersion,
    savedToIncoming: true,
    emailNotified,
  });
};
