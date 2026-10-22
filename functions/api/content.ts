import { isAuthorized, json } from '../_lib/auth';
import type { Ctx } from '../_lib/auth';

interface SiteContent {
  prices: {
    bootcampUSD: string;
    bootcampARS: string;
    annualUSD: string;
    annualARS: string;
  };
  videos: Record<string, string>;
  heroImages: string[];
}

const PRICE_KEYS = ['bootcampUSD', 'bootcampARS', 'annualUSD', 'annualARS'] as const;

const sanitize = (input: unknown): SiteContent | null => {
  if (!input || typeof input !== 'object') return null;
  const obj = input as Record<string, unknown>;

  const pricesIn = obj.prices as Record<string, unknown> | undefined;
  if (!pricesIn || typeof pricesIn !== 'object') return null;

  const prices: Record<string, string> = {};
  for (const key of PRICE_KEYS) {
    const value = pricesIn[key];
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > 24) return null;
    prices[key] = trimmed;
  }

  const videos: Record<string, string> = {};
  if (obj.videos && typeof obj.videos === 'object') {
    for (const [key, value] of Object.entries(obj.videos as Record<string, unknown>)) {
      if (typeof value !== 'string') continue;
      const id = value.trim().slice(0, 64);
      if (id) videos[key.slice(0, 48)] = id;
    }
  }

  const heroIn = obj.heroImages;
  if (!Array.isArray(heroIn) || heroIn.length === 0 || heroIn.length > 12) return null;
  const heroImages = heroIn.map((src) =>
    typeof src === 'string' ? src.trim().slice(0, 500) : ''
  );
  if (heroImages.some((src) => !src)) return null;

  return { prices: prices as SiteContent['prices'], videos, heroImages };
};

export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  if (!ctx.env.SITE_CONTENT) {
    return json({ content: null, source: 'default' });
  }
  const stored = (await ctx.env.SITE_CONTENT.get('site', 'json')) as {
    content?: unknown;
    updatedAt?: string;
  } | null;

  const content = sanitize(stored?.content);
  return json(
    { content, updatedAt: stored?.updatedAt ?? null, source: content ? 'kv' : 'default' },
    200,
    { 'Cache-Control': 'public, max-age=0, s-maxage=60' }
  );
};

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  const { request, env } = ctx;

  if (!(await isAuthorized(ctx))) {
    return json({ ok: false, error: 'Sesión vencida. Volvé a iniciar sesión.' }, 401);
  }
  if (!env.SITE_CONTENT) {
    return json({ ok: false, error: 'Falta el binding SITE_CONTENT (KV) en Cloudflare Pages.' }, 503);
  }

  const raw = await request.text();
  if (raw.length > 20000) {
    return json({ ok: false, error: 'El contenido es demasiado grande.' }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'JSON inválido.' }, 400);
  }

  const content = sanitize(body);
  if (!content) {
    return json({ ok: false, error: 'Contenido inválido.' }, 400);
  }

  const updatedAt = new Date().toISOString();
  await env.SITE_CONTENT.put('site', JSON.stringify({ content, updatedAt }));
  return json({ ok: true, updatedAt });
};
