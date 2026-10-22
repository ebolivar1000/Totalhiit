import { HERO_COLLAGE } from './heroCollage';

/**
 * Contenido editable desde el panel de administración (admin.html).
 * Se guarda en localStorage del navegador: los cambios se ven en este navegador
 * (y en el sitio público abierto en el mismo navegador), no en otros dispositivos.
 * Ver ai/decisions.md (Decisión 14).
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

export const loadSiteContent = (): SiteContent => {
  const base = clone(DEFAULT_SITE_CONTENT);
  try {
    const raw = localStorage.getItem(SITE_CONTENT_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      prices: { ...base.prices, ...(parsed.prices ?? {}) },
      videos: { ...base.videos, ...(parsed.videos ?? {}) },
      heroImages:
        Array.isArray(parsed.heroImages) && parsed.heroImages.length > 0
          ? parsed.heroImages
          : base.heroImages,
    };
  } catch {
    return base;
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
