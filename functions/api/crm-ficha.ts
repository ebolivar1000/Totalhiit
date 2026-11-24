import { json } from '../_lib/auth';
import type { Ctx } from '../_lib/auth';

const CRM_STATE_KEY = 'crm_state_v1';
const INCOMING_FICHAS_KEY = 'incoming_fichas_v1';

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

  const ficha = body as Record<string, unknown>;
  if (typeof ficha.id !== 'string' || !ficha.id.trim() || typeof ficha.nombre !== 'string' || !ficha.nombre.trim()) {
    return json({ ok: false, error: 'Faltan campos obligatorios de la ficha.' }, 400);
  }

  // 1. Guardar siempre en incoming_fichas_v1 para no perder ningún registro
  const incoming =
    ((await ctx.env.SITE_CONTENT.get(INCOMING_FICHAS_KEY, 'json')) as Array<Record<string, unknown>>) || [];
  const nextIncoming = [
    ficha,
    ...incoming.filter((item) => item && item.id !== ficha.id),
  ];
  await ctx.env.SITE_CONTENT.put(INCOMING_FICHAS_KEY, JSON.stringify(nextIncoming));

  // 2. Si existe el estado global del CRM, actualizarlo
  const current = (await ctx.env.SITE_CONTENT.get(CRM_STATE_KEY, 'json')) as StoredCrmState | null;
  let nextVersion = 1;
  if (current && Array.isArray(current.fichas)) {
    const nextFichas = [
      ficha,
      ...current.fichas.filter((item) => item && item.id !== ficha.id),
    ];
    nextVersion = (current.version ?? 0) + 1;
    const nextState: StoredCrmState = {
      ...current,
      fichas: nextFichas,
      version: nextVersion,
      updatedAt: new Date().toISOString(),
      updatedBy: 'registro-alumna',
    };
    await ctx.env.SITE_CONTENT.put(CRM_STATE_KEY, JSON.stringify(nextState));
  }

  // 3. Notificación automática por email a los administradores vía FormSubmit
  const nombreAlumna = String(ficha.nombre_completo || `${ficha.nombre} ${ficha.apellido || ''}`).trim();
  const emailAlumna = String(ficha.email || '').trim();
  const telAlumna = String(ficha.telefono_whatsapp || '').trim();
  const objetivo = String(ficha.objetivo_principal || 'No especificado').trim();
  const ubicacion = String(ficha.localidad_pais || 'No especificada').trim();

  const emailBody = {
    _captcha: 'false',
    _template: 'table',
    _subject: `🚨 NUEVA ALUMNA REGISTRADA EN TOTALHIIT: ${nombreAlumna}`,
    _cc: 'ebolivar1000@gmail.com,caribialabs@gmail.com',
    _replyto: emailAlumna || 'totalhiit1@gmail.com',
    alumna: nombreAlumna,
    whatsapp: telAlumna,
    email: emailAlumna,
    edad: ficha.edad,
    ubicacion,
    objetivo,
    altura_peso: `${ficha.altura} | ${ficha.peso} (Talla ${ficha.talla_remera})`,
    alergias: ficha.alergias,
    lesiones_patologias: ficha.lesiones_desde_cuando || ficha.problemas_musculares_oseos,
    medicamentos: ficha.medicamentos_detalle || ficha.toma_medicamentos,
    contacto_emergencia: ficha.contacto_emergencia,
    fecha_registro: ficha.fecha_registro,
    link_crm: 'https://totalhiit.pages.dev/crm',
  };

  // Enviar a totalhiit1@gmail.com y ebolivar1000@gmail.com como respaldo directo
  try {
    fetch('https://formsubmit.co/ajax/totalhiit1@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://totalhiit.pages.dev',
        Referer: 'https://totalhiit.pages.dev/crm/registro/',
      },
      body: JSON.stringify(emailBody),
    }).catch(() => {});

    fetch('https://formsubmit.co/ajax/ebolivar1000@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://totalhiit.pages.dev',
        Referer: 'https://totalhiit.pages.dev/crm/registro/',
      },
      body: JSON.stringify(emailBody),
    }).catch(() => {});
  } catch {}

  return json({ ok: true, version: nextVersion, savedToIncoming: true });
};
