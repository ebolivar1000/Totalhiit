import {
  effectiveAuth,
  hashPassword,
  isAuthorized,
  json,
  verifyPassword,
} from '../_lib/auth';
import type { Ctx, StoredAuth } from '../_lib/auth';

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  const { request, env } = ctx;

  if (!(await isAuthorized(ctx))) {
    return json({ ok: false, error: 'Sesión vencida. Volvé a iniciar sesión.' }, 401);
  }
  if (!env.SITE_CONTENT) {
    return json({ ok: false, error: 'Falta el binding SITE_CONTENT (KV) en Cloudflare Pages.' }, 503);
  }

  let body: { current?: unknown; next?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'Pedido inválido.' }, 400);
  }

  const current = String(body.current ?? '');
  const next = String(body.next ?? '');

  if (next.length < 8) {
    return json({ ok: false, error: 'La nueva clave debe tener al menos 8 caracteres.' }, 400);
  }
  if (next === current) {
    return json({ ok: false, error: 'La nueva clave debe ser distinta de la actual.' }, 400);
  }

  const auth = await effectiveAuth(env);
  if (!auth || !(await verifyPassword(auth.hash, current))) {
    return json({ ok: false, error: 'La clave actual no es correcta.' }, 401);
  }

  const stored: StoredAuth = { user: auth.user, hash: await hashPassword(next) };
  await env.SITE_CONTENT.put('auth', JSON.stringify(stored));
  return json({ ok: true });
};
