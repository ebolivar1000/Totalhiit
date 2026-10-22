import { clearSessionCookie, json } from '../_lib/auth';

export const onRequestPost = async (): Promise<Response> =>
  json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie() });
