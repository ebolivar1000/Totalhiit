import { HERO_COLLAGE } from './heroCollage';

/**
 * Contenido editable desde el panel de administración (admin.html).
 *
 * Fuente de verdad en producción: Cloudflare KV a través de `/api/content`
 * (ver `functions/api/content.ts`). `localStorage` queda como caché local y
 * como almacenamiento de respaldo cuando no hay backend (dev o vista previa).
 */

export interface SitePrices {
  bootcampUSD: string;
  bootcampARS: string;
  annualUSD: string;
  annualARS: string;
}

export interface SiteContent {
  prices: SitePrices;
  /** Overrides de YouTube por id de video (vacío = valor original de bootcampData). */
  videos: Record<string, string>;
  /** Siete URLs de las celdas del collage del Hero. */
  heroImages: string[];
}

export const SITE_CONTENT_KEY = 'totalhiit.site.v1';
export const SITE_CONTENT_EVENT = 'totalhiit:site-updated';
export const SITE_CONTENT_API = '/api/content';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  prices: {
    bootcampUSD: '$39',
    bootcampARS: '$49.999',
    annualUSD: '$129',
    annualARS: '$159.999',
  },
  videos: {},
  heroImages: HERO_COLLAGE.map((item) => item.src),
};

const clone = (content: SiteContent): SiteContent => ({
  prices: { ...content.prices },
  videos: { ...content.videos },
  heroImages: [...content.heroImages],
});

const normalize = (input: unknown): SiteContent | null => {
  if (!input || typeof input !== 'object') return null;
  const parsed = input as Partial<SiteContent>;
  const base = clone(DEFAULT_SITE_CONTENT);

  if (parsed.prices && typeof parsed.prices === 'object') {
    for (const key of Object.keys(base.prices) as (keyof SitePrices)[]) {
      const value = parsed.prices[key];
      if (typeof value === 'string' && value.trim()) base.prices[key] = value.trim();
    }
  }

  if (parsed.videos && typeof parsed.videos === 'object') {
    for (const [id, value] of Object.entries(parsed.videos)) {
      if (typeof value === 'string' && value.trim()) base.videos[id] = value.trim();
    }
  }

  if (Array.isArray(parsed.heroImages) && parsed.heroImages.length > 0) {
    const images = parsed.heroImages.filter(
      (src): src is string => typeof src === 'string' && src.trim().length > 0
    );
    if (images.length > 0) base.heroImages = images;
  }

  return base;
};

export const loadSiteContent = (): SiteContent => {
  try {
    const raw = localStorage.getItem(SITE_CONTENT_KEY);
    if (!raw) return clone(DEFAULT_SITE_CONTENT);
    return normalize(JSON.parse(raw)) ?? clone(DEFAULT_SITE_CONTENT);
  } catch {
    return clone(DEFAULT_SITE_CONTENT);
  }
};

export const saveSiteContent = (content: SiteContent): void => {
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event(SITE_CONTENT_EVENT));
};

export const resetSiteContent = (): void => {
  localStorage.removeItem(SITE_CONTENT_KEY);
  window.dispatchEvent(new Event(SITE_CONTENT_EVENT));
};

/**
 * Lee el contenido publicado en producción. Devuelve null si no hay backend
 * (dev con Vite) o si la respuesta no es válida.
 */
export const fetchRemoteSiteContent = async (): Promise<SiteContent | null> => {
  if (typeof fetch !== 'function') return null;

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? window.setTimeout(() => controller.abort(), 4000) : null;

  try {
    const res = await fetch(SITE_CONTENT_API, {
      headers: { Accept: 'application/json' },
      signal: controller?.signal ?? undefined,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    if (!(res.headers.get('Content-Type') || '').includes('application/json')) return null;

    const data = (await res.json()) as { content?: unknown };
    const content = normalize(data.content);
    if (!content) return null;

    localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
    return content;
  } catch {
    return null;
  } finally {
    if (timer) window.clearTimeout(timer);
  }
};

export interface PublishResult {
  ok: boolean;
  error?: string;
}

/** Publica el contenido para todos los visitantes (requiere sesión del admin). */
export const publishSiteContent = async (content: SiteContent): Promise<PublishResult> => {
  try {
    const res = await fetch(SITE_CONTENT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(content),
    });

    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

    if (res.status === 404 || res.status === 405) {
      return { ok: false, error: 'Este entorno no tiene backend de publicación.' };
    }
    if (!res.ok || !data?.ok) {
      return { ok: false, error: data?.error ?? `Error ${res.status} al publicar.` };
    }

    saveSiteContent(content);
    return { ok: true };
  } catch {
    return { ok: false, error: 'No se pudo conectar con el servidor.' };
  }
};
