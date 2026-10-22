import {
  clearFailures,
  createToken,
  effectiveAuth,
  isRateLimited,
  json,
  recordFailure,
  sessionCookie,
  verifyPassword,
} from '../_lib/auth';
import type { Ctx } from '../_lib/auth';

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  const { request, env } = ctx;

  if (!env.SESSION_SECRET) {
    return json(
      { ok: false, error: 'Falta configurar SESSION_SECRET en Cloudflare Pages.' },
      503
    );
  }

  if (await isRateLimited(env, request)) {
    return json({ ok: false, error: 'Demasiados intentos. Probá de nuevo en unos minutos.' }, 429);
  }

  let body: { user?: unknown; password?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'Pedido inválido.' }, 400);
  }

  const user = String(body.user ?? '').trim();
  const password = String(body.password ?? '');
  if (!user || !password) {
    return json({ ok: false, error: 'Completá usuario y clave.' }, 400);
  }

  const auth = await effectiveAuth(env);
  if (!auth) {
    return json(
      {
        ok: false,
        error: 'El admin no está configurado: agregá ADMIN_USER y ADMIN_PASSWORD_HASH como secretos.',
      },
      503
    );
  }

  const userOk = user.toLowerCase() === auth.user.toLowerCase();
  const passOk = await verifyPassword(auth.hash, password);

  if (!userOk || !passOk) {
    await recordFailure(env, request);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return json({ ok: false, error: 'Usuario o clave incorrectos.' }, 401);
  }

  await clearFailures(env, request);
  const token = await createToken(env.SESSION_SECRET, auth.user);
  return json({ ok: true, user: auth.user }, 200, { 'Set-Cookie': sessionCookie(token) });
};
