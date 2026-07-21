# Memorinhas — Backend

API NestJS do Memorinhas: autenticação JWT, lojas, produtos, pedidos, frete, e-mail e upload via Cloudinary.

## Pré-requisitos

- Node.js 20+ (22+ recomendado)
- npm
- Docker (PostgreSQL via `docker-compose`)

## Como rodar

### API no host (dev)

```bash
cp .env.example .env
docker compose up -d vogue_backend_db
npm install
npm run start:dev
```

- Health check: http://localhost:3001/api/v0/system-check
- Swagger: http://localhost:3001/api/v0

### API no Docker

```bash
cp .env.example .env
docker compose up -d --build
```

Sobe Postgres + API. A API publica `PORT` (padrão `3001`). O compose sobrescreve `DB_HOST` para o serviço do banco.

### Tunnel (Cloudflare)

Expõe a API em `memorinhas-api.thalysdev.com` (configurado no painel):

```bash
# 1. Zero Trust → Networks → Tunnels → Create
# 2. Public Hostname: memorinhas-api.thalysdev.com → http://api:3001
# 3. Copie o token para CLOUDFLARE_TUNNEL_TOKEN no .env
docker compose --profile tunnel up -d --build
```

Ajuste `PORT`, banco e demais variáveis no `.env`. Nunca commite o `.env`.

## Scripts

```bash
npm run start:dev    # desenvolvimento com watch
npm run build
npm run start:prod
npm run lint
npm run test
npm run test:e2e
```

## Stack

| Área | Tecnologia |
| ---- | ---------- |
| Framework | NestJS 11 |
| Banco | PostgreSQL 16, TypeORM |
| Auth | Passport JWT + Local |
| Docs | Swagger / OpenAPI |
| Mail | Nodemailer + Handlebars |
| Storage | Cloudinary (assinaturas) |
| Validação | class-validator, class-transformer |

## Módulos

```
src/
├── auth/            # Login, JWT, reset de senha
├── user/            # Usuários
├── roles/           # Papéis (RBAC)
├── store/           # Loja e configurações
├── product/         # Produtos
├── product-types/   # Tipos de produto
├── order/           # Pedidos e frete
├── mail/            # E-mails transacionais
├── storage/         # Assinaturas Cloudinary
├── seeding/         # Seed inicial (FEATURE_SEEDING)
├── feature-flags/   # Flags via env (FEATURE_*)
├── security/        # Guards e decorators
├── config/          # app.config, orm.config
└── helpers/         # Utilitários
```

## Variáveis de ambiente

Copie `.env.example` para `.env`. Principais:

| Variável | Descrição | Padrão |
| -------- | --------- | ------ |
| `PORT` | Porta da API | `3001` |
| `API_VERSION` | Prefixo da API | `v0` |
| `FRONTEND_URL` | Origin do frontend (CORS) | `http://localhost:3000` |
| `APP_NAME` | Nome da aplicação | `Memorinhas` |
| `STORE_BRAND_URL` | Identificador da loja | `memorinhas` |
| `FEATURE_SEEDING` | Seed automático no boot | `true` |
| `DB_*` | Conexão PostgreSQL | ver `.env.example` |
| `JWT_SECRET_KEY` | Segredo JWT | — |
| `MAIL_DRIVER` | `smtp` / `ethereal` / `console` | `console` |
| `CLOUDINARY_*` | Credenciais de upload | — |
| `SYSTEM_ADMIN_*` | Admin criado no seed | — |
| `CLOUDFLARE_TUNNEL_TOKEN` | Token do tunnel (profile `tunnel`) | — |

## Feature flags

```env
FEATURE_SEEDING=true
```

Uso no código: `FeatureFlagsService.isEnabled('seeding')`.

## Frontend

O frontend espera a API em:

```env
VITE_API_URL=http://localhost:3001
VITE_API_VERSION=v0
```

## Licença

MIT — veja [LICENSE](LICENSE).
