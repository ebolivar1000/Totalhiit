import { useEffect, useState } from 'react';
import {
  fetchRemoteSiteContent,
  loadSiteContent,
  SITE_CONTENT_EVENT,
  SITE_CONTENT_KEY,
  SiteContent,
} from '../data/siteContent';

/**
 * Lee el contenido editable. Pinta primero la caché local (instantáneo) y luego
 * aplica lo publicado en producción (`/api/content`). Se re-renderiza cuando el
 * admin guarda en este navegador (evento propio) o en otra pestaña (`storage`).
 */
export const useSiteContent = (): SiteContent => {
  const [content, setContent] = useState<SiteContent>(() => loadSiteContent());

  useEffect(() => {
    let alive = true;

    fetchRemoteSiteContent().then((remote) => {
      if (alive && remote) setContent(remote);
    });

    const refresh = () => setContent(loadSiteContent());
    const onStorage = (event: StorageEvent) => {
      if (event.key === SITE_CONTENT_KEY || event.key === null) refresh();
    };

    window.addEventListener(SITE_CONTENT_EVENT, refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      alive = false;
      window.removeEventListener(SITE_CONTENT_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return content;
};
