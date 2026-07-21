export type PageMeta = {
  segments: string[];
  description?: string;
  robots?: string;
};

export const DEFAULT_DESCRIPTION =
  'Ímãs de fotos artesanais para transformar momentos em lembranças diárias.';

const PRIVATE_ROBOTS = 'noindex, nofollow';

const PAGE_META: { match: string | RegExp; meta: PageMeta }[] = [
  {
    match: /^\/$/,
    meta: {
      segments: ['Eternizando Memórias'],
      description: DEFAULT_DESCRIPTION,
    },
  },
  {
    match: '/produtos',
    meta: {
      segments: ['Produtos'],
      description: 'Catálogo de ímãs e produtos Memorinhas.',
    },
  },
  {
    match: '/customizar',
    meta: {
      segments: ['Customizar'],
      description: 'Personalize seus ímãs de fotos Memorinhas.',
    },
  },
  {
    match: '/lojista/login',
    meta: {
      segments: ['Lojista', 'Login'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: /^\/lojista\/pedidos\/[^/]+$/,
    meta: {
      segments: ['Lojista', 'Pedido'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/lojista/pedidos',
    meta: {
      segments: ['Lojista', 'Pedidos'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/lojista/produtos/novo',
    meta: {
      segments: ['Lojista', 'Novo produto'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: /^\/lojista\/produtos\/[^/]+$/,
    meta: {
      segments: ['Lojista', 'Editar produto'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/lojista/produtos',
    meta: {
      segments: ['Lojista', 'Produtos'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/lojista/entrega',
    meta: {
      segments: ['Lojista', 'Entrega'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/lojista/loja',
    meta: {
      segments: ['Lojista', 'Loja'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/lojista/perfil',
    meta: {
      segments: ['Lojista', 'Perfil'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/lojista',
    meta: {
      segments: ['Lojista'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/admin/login',
    meta: {
      segments: ['Admin', 'Login'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/admin/lojas',
    meta: {
      segments: ['Admin', 'Lojas'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/admin/loja',
    meta: {
      segments: ['Admin', 'Lojas'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/admin/usuarios',
    meta: {
      segments: ['Admin', 'Usuários'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/admin/papeis',
    meta: {
      segments: ['Admin', 'Papéis'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/admin/tipos-produto',
    meta: {
      segments: ['Admin', 'Tipos de produto'],
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/admin',
    meta: {
      segments: ['Admin'],
      robots: PRIVATE_ROBOTS,
    },
  },
];

const FALLBACK_META: PageMeta = {
  segments: ['Página não encontrada'],
  robots: 'noindex, nofollow',
};

export function resolvePageMeta(pathname: string): PageMeta {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  for (const { match, meta } of PAGE_META) {
    if (typeof match === 'string') {
      if (normalized === match) return meta;
      if (
        (match === '/lojista' || match === '/admin') &&
        normalized.startsWith(`${match}/`)
      ) {
        return meta;
      }
      continue;
    }
    if (match.test(normalized)) return meta;
  }

  return FALLBACK_META;
}

