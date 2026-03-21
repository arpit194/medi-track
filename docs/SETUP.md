# MediTrack — Developer Setup

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 20+ | |
| pnpm | 9+ | `npm install -g pnpm` |
| PostgreSQL | 15+ | Local install or a hosted instance (e.g. Supabase, Neon) |

## 1. Install dependencies

```bash
pnpm install
```

## 2. Configure environment variables

Copy the example file and fill in the values:

```bash
cp apps/api/.env.example apps/api/.env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string — `postgresql://user:password@host:port/dbname` |
| `PORT` | Port the API runs on. Defaults to `3001`. |
| `FRONTEND_URL` | URL of the frontend, used for CORS. Defaults to `http://localhost:3000`. |
| `JWT_SECRET` | Secret used to sign access tokens. Use a long random string. |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens. Must be different from `JWT_SECRET`. |
| `UPLOADTHING_TOKEN` | Token from your [UploadThing](https://uploadthing.com) project for file storage. |

## 3. Set up the database

Run migrations to create all tables:

```bash
pnpm --filter @medi-track/api db:migrate
```

Optionally seed with sample data:

```bash
pnpm --filter @medi-track/api db:seed
```

## 4. Run the app

Start both servers in separate terminals:

```bash
# Terminal 1 — API (http://localhost:3001)
pnpm dev:api

# Terminal 2 — Web (http://localhost:3000)
pnpm dev
```

The web app proxies `/api` requests to the API server automatically via the Vite config.

## API documentation

Swagger UI is available at [http://localhost:3001/api/docs](http://localhost:3001/api/docs) when the API is running.

## Scripts reference

### Root workspace

| Script | Description |
|---|---|
| `pnpm dev` | Start the web app (port 3000) |
| `pnpm dev:api` | Start the API in watch mode (port 3001) |
| `pnpm dev:api:debug` | Start the API in debug + watch mode |
| `pnpm build` | Build the web app for production |
| `pnpm build:api` | Build the API for production |
| `pnpm lint` | Run ESLint on the web app |
| `pnpm format` | Check formatting with Prettier |

### API (`apps/api`)

| Script | Description |
|---|---|
| `pnpm dev` | Start in watch mode |
| `pnpm dev:debug` | Start in debug + watch mode |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Run compiled output |
| `pnpm db:migrate` | Run pending Prisma migrations |
| `pnpm db:migrate:reset` | Reset database and re-run all migrations |
| `pnpm db:migrate:deploy` | Deploy migrations (for production) |
| `pnpm db:generate` | Regenerate Prisma client after schema changes |
| `pnpm db:studio` | Open Prisma Studio (visual DB browser) |
| `pnpm db:seed` | Seed the database with sample data |
| `pnpm db:reset` | Reset and re-seed the database |

### Web (`apps/web`)

| Script | Description |
|---|---|
| `pnpm dev` | Start Vite dev server (port 3000) |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Check formatting with Prettier |
| `pnpm check` | Format and lint in one command |

## Forgot password (dev)

Email sending is not yet wired up. When a forgot password request is submitted, the reset link is printed to the API console:

```
[DEV] Password reset link: http://localhost:3000/reset-password?token=...
```

Copy the URL and open it in the browser to test the reset flow.
