# Memorinhas

Sistema de e-commerce para personalização e venda de produtos fotográficos (ímãs, porta-retratos e similares). Inclui vitrine pública, painel do lojista e painel administrativo.

## Estrutura

```
memorinhas-sys/
├── frontend/   # React + Vite (vitrine, lojista, admin)
├── backend/    # NestJS + PostgreSQL (API)
└── design_system/
```

| Pasta | Stack | Porta padrão |
| ----- | ----- | ------------ |
| `frontend/` | React 19, Vite, Tailwind, TanStack Query, Zustand | `3000` |
| `backend/` | NestJS 11, TypeORM, PostgreSQL 16 | `3001` |

## Pré-requisitos

- Node.js 20+ (22+ recomendado)
- npm
- Docker (para o PostgreSQL)

## Como subir o projeto

### 1. Backend

```bash
cd backend
cp .env.example .env
docker compose up -d memorinhas_db
npm install
npm run start:dev
```

Ou API + banco no Docker: `npm run deploy` (ou `docker compose up -d --build`). Tunnel Cloudflare: ver [backend/README.md](backend/README.md).

- API: http://localhost:3001/api/v0/system-check
- Swagger: http://localhost:3001/api/v0

Detalhes em [backend/README.md](backend/README.md).

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- App: http://localhost:3000

Detalhes em [frontend/README.md](frontend/README.md).

## Áreas da aplicação

| Área | URL | Descrição |
| ---- | --- | --------- |
| Vitrine | `/` | Landing, catálogo e customizador |
| Lojista | `/lojista` | Pedidos, produtos, frete e loja |
| Admin | `/admin` | Lojas, usuários, papéis e tipos de produto |

## Licença

O backend está sob MIT — veja [backend/LICENSE](backend/LICENSE).
