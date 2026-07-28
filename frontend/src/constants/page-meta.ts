export type PageMeta = {
  title?: string;
  segments?: string[];
  description?: string;
  robots?: string;
};

export const DEFAULT_DESCRIPTION =
  'Transforme suas fotos em ímãs artesanais com acabamento premium. Produzidos em Canoas/RS, com entrega na região. Peça pelo WhatsApp.';

const PRIVATE_ROBOTS = 'noindex, nofollow';

const PAGE_META: { match: string | RegExp; meta: PageMeta }[] = [
  {
    match: /^\/$/,
    meta: {
      title: 'Ímãs de Fotos Artesanais em Canoas | Memorinhas',
      description: DEFAULT_DESCRIPTION,
    },
  },
  {
    match: /^\/produtos\/[^/]+$/,
    meta: {
      title: 'Detalhe do Produto | Memorinhas',
      description:
        'Veja detalhes do ímã personalizado Memorinhas: descrição, especificações e adicione ao carrinho.',
    },
  },
  {
    match: '/produtos',
    meta: {
      title: 'Catálogo de Ímãs Personalizados | Memorinhas',
      description:
        'Veja os ímãs de fotos Memorinhas. Escolha o tamanho, personalize com suas fotos e peça com entrega em Canoas e região metropolitana.',
    },
  },
  {
    match: '/customizar',
    meta: {
      title: 'Personalizar Ímãs | Memorinhas',
      description: 'Envie suas fotos e monte o mural de ímãs Memorinhas.',
      robots: PRIVATE_ROBOTS,
    },
  },
  {
    match: '/termos',
    meta: {
      title: 'Termos de Uso | Memorinhas',
      description: 'Termos de uso da loja Memorinhas: pedidos, personalização e entrega.',
    },
  },
  {
    match: '/privacidade',
    meta: {
      title: 'Política de Privacidade | Memorinhas',
      description:
        'Como a Memorinhas trata seus dados pessoais, fotos e informações de pedido.',
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
    match: '/admin/campos-produto',
    meta: {
      segments: ['Admin', 'Campos de produto'],
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

export function buildPageTitle(meta: PageMeta, appName: string): string {
  if (meta.title) return meta.title;
  return [appName, ...(meta.segments ?? [])].join(' | ');
}
