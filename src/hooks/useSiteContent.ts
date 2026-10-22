import { useEffect, useState } from 'react';
import {
  loadSiteContent,
  SITE_CONTENT_EVENT,
  SITE_CONTENT_KEY,
  SiteContent,
} from '../data/siteContent';

/**
 * Lee el contenido editable y se re-renderiza cuando el admin guarda cambios
 * (mismo navegador: evento propio; otras pestañas: evento `storage`).
 */
export const useSiteContent = (): SiteContent => {
  const [content, setContent] = useState<SiteContent>(() => loadSiteContent());

  useEffect(() => {
    const refresh = () => setContent(loadSiteContent());
    const onStorage = (event: StorageEvent) => {
      if (event.key === SITE_CONTENT_KEY || event.key === null) refresh();
    };

    window.addEventListener(SITE_CONTENT_EVENT, refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(SITE_CONTENT_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return content;
};
