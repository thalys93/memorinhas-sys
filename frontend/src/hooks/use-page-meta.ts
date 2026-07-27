import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { env } from '@/constants/env';
import {
  buildPageTitle,
  DEFAULT_DESCRIPTION,
  resolvePageMeta,
} from '@/constants/page-meta';

const OG_IMAGE =
  'https://res.cloudinary.com/dh39ahmpj/image/upload/v1784652296/projects-images/ChatGPT_Image_21_de_jul._de_2026_13_44_42_c4x6ml.png';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: Record<string, unknown> | null) {
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }
  let el = existing as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function buildOrganizationSchema(canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: env.appName,
    description: DEFAULT_DESCRIPTION,
    url: env.siteUrl,
    image: OG_IMAGE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Canoas',
      addressRegion: 'RS',
      addressCountry: 'BR',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Canoas e Região Metropolitana',
    },
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: 'Ímãs de fotos artesanais',
        description:
          'Ímãs personalizados com suas fotos, impressão fotográfica premium e produção artesanal em Canoas/RS.',
      },
    },
    mainEntityOfPage: canonicalUrl,
  };
}

export function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolvePageMeta(pathname);
    const title = buildPageTitle(meta, env.appName);
    const description = meta.description ?? DEFAULT_DESCRIPTION;
    const canonicalUrl = `${env.siteUrl}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
    const robots = meta.robots ?? 'index, follow';
    const isPublicIndexable = !robots.includes('noindex');

    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);
    upsertLink('canonical', canonicalUrl);

    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:locale', 'pt_BR');
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:site_name', env.appName);
    upsertMeta('property', 'og:image', OG_IMAGE);
    upsertMeta(
      'property',
      'og:image:alt',
      'Memorinhas — ímãs artesanais das suas fotos favoritas',
    );

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', OG_IMAGE);

    upsertJsonLd(
      'ld-local-business',
      isPublicIndexable && (pathname === '/' || pathname === '')
        ? buildOrganizationSchema(canonicalUrl)
        : null,
    );
  }, [pathname]);
}
