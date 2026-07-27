# Memorinhas — Frontend

Aplicação React do Memorinhas: vitrine pública, painel do lojista e painel administrativo.

## Pré-requisitos

- Node.js 20+
- npm
- Backend rodando (veja [../backend/README.md](../backend/README.md))

## Como rodar

```bash
cp .env.example .env
npm install
npm run dev
```

App: http://localhost:3000

## Scripts

```bash
npm run dev       # Vite em http://localhost:3000
npm run build     # TypeScript + build de produção
npm run preview   # Preview do build
npm run deploy    # build + firebase deploy
```

## Stack

| Área | Tecnologia |
| ---- | ---------- |
| UI | React 19, Vite 6 |
| Estilo | Tailwind CSS 4 |
| Roteamento | React Router 7 |
| Dados | TanStack Query, Axios |
| Estado | Zustand |
| Componentes | Radix UI |

## Variáveis de ambiente

Copie `.env.example` para `.env`:

| Variável | Descrição | Padrão |
| -------- | --------- | ------ |
| `VITE_API_URL` | URL base da API | `http://localhost:3001` |
| `VITE_API_VERSION` | Versão da API | `v0` |
| `VITE_STORE_BRAND_URL` | Identificador da loja | `memorinhas` |
| `VITE_APP_NAME` | Nome exibido no app | `Memorinhas` |

## Estrutura

```
src/
├── subdomains/
│   ├── app/          # Landing, catálogo, customizador, legal
│   ├── shopkeeper/   # Painel do lojista
│   └── admin/        # Painel administrativo
├── components/       # UI compartilhada
├── layouts/          # Layouts público / lojista / admin
├── services/         # Clientes HTTP da API
├── hooks/            # Hooks e queries
├── store/            # Zustand (auth, cart, theme)
├── routes/           # Mapa de rotas
└── lib/              # Utilitários (frete, geocode, etc.)
```

## Rotas principais

| Área | Prefixo | Exemplos |
| ---- | ------- | -------- |
| Pública | `/` | `/`, `/produtos`, `/customizar` |
| Lojista | `/lojista` | `/lojista/pedidos`, `/lojista/produtos` |
| Admin | `/admin` | `/admin/lojas`, `/admin/usuarios` |
