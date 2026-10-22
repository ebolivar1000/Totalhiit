import { isAuthorized, json } from '../_lib/auth';
import type { Ctx } from '../_lib/auth';

export const onRequestGet = async (ctx: Ctx): Promise<Response> =>
  json({ ok: await isAuthorized(ctx) });
