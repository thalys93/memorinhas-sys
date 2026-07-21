import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { env } from '@/constants/env';
import { DEFAULT_DESCRIPTION, resolvePageMeta } from '@/constants/page-meta';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolvePageMeta(pathname);
    const title = [env.appName, ...meta.segments].join(' | ');

    document.title = title;

    const description = meta.description ?? DEFAULT_DESCRIPTION;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:locale', 'pt_BR');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'robots', meta.robots ?? 'index, follow');
  }, [pathname]);
}
