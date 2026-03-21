# MediTrack — Architecture

## Monorepo structure

```
medi-track/
├── apps/
│   ├── api/                  # NestJS backend
│   │   ├── prisma/
│   │   │   ├── migrations/   # Prisma migration files
│   │   │   ├── schema.prisma # Database schema
│   │   │   └── seed.ts       # Sample data seed script
│   │   └── src/
│   │       ├── auth/         # Auth module (login, signup, refresh, reset)
│   │       ├── reports/      # Reports CRUD + file upload
│   │       ├── share/        # Share links (create, revoke, public view)
│   │       ├── users/        # User profile management
│   │       ├── prisma/       # PrismaService (shared DB client)
│   │       └── common/       # Shared types, decorators, utilities
│   │
│   └── web/                  # TanStack Start frontend
│       └── src/
│           ├── api/          # API client functions + mock implementations
│           ├── components/
│           │   ├── ui/       # shadcn components — never edit manually
│           │   ├── shared/   # Components used across multiple routes
│           │   ├── auth/     # Components for /login, /signup, etc.
│           │   └── app/      # Components for authenticated app routes
│           ├── hooks/        # TanStack Query hooks (per domain)
│           ├── lib/          # Zod schemas, utilities
│           └── routes/       # File-based routes (TanStack Router)
│
└── packages/
    └── types/                # Shared TypeScript types (used by both apps)
```

## Tech stack

### Backend (`apps/api`)

| Layer | Choice | Reason |
|---|---|---|
| Framework | NestJS | Structured, module-based; built-in DI, guards, decorators |
| ORM | Prisma | Type-safe queries, excellent migration tooling |
| Database | PostgreSQL | Relational, reliable, widely hosted |
| Auth | JWT (access + refresh) | Stateless; no session storage needed |
| File storage | UploadThing | Simple managed file uploads without S3 boilerplate |
| API docs | Swagger / OpenAPI | Auto-generated, decorator-driven |

### Frontend (`apps/web`)

| Layer | Choice | Reason |
|---|---|---|
| Framework | TanStack Start + TanStack Router | File-based routing, type-safe navigation, SSR-ready |
| UI | React 19 | |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Components | shadcn v4 (base-nova / Base UI) | Accessible, unstyled primitives; easy to customise |
| Data fetching | TanStack Query | Caching, background refetch, mutation state |
| Forms | TanStack Form v1 + Zod | Type-safe form state; Zod for validation |
| HTTP client | Axios | Interceptors for token refresh handling |

## Authentication flow

```
Login / Signup
  └── POST /api/auth/login
        ├── Returns: { token, user }  (access token, 1h JWT)
        └── Sets:    mt_refresh_token cookie  (refresh token, 30d JWT, HttpOnly)

Authenticated requests
  └── Authorization: Bearer <access_token>

Token expiry (401 response)
  └── Axios interceptor catches 401
        ├── Queues in-flight requests
        ├── POST /api/auth/refresh  (sends refresh cookie automatically)
        │     └── Returns new access token + rotates refresh cookie
        └── Retries all queued requests with new token

Logout
  └── POST /api/auth/logout  (clears the cookie server-side)
        └── Frontend clears access token from localStorage
```

## Share link flow

```
Owner creates link
  └── POST /api/share  { reportIds, label, expiresIn }
        └── Generates a random token, stores expiry datetime

Doctor opens link
  └── GET /api/s/:token  (no auth required)
        ├── Validates: not revoked, not expired
        ├── Returns: label, expiresAt, reports[]
        └── If one_time: sets isRevoked = true immediately

Owner manages links
  ├── DELETE /api/share/:id   → sets isRevoked = true (soft revoke)
  └── PATCH  /api/share/:id/reactivate  → clears revoked flag, sets new expiry
```

## Key frontend patterns

### Route files are thin
Route files register the route and import the page component — no JSX, no logic. All UI lives in `src/components/`.

### Query hooks per domain
Each domain has a hooks file (`hooks/auth.ts`, `hooks/reports.ts`, `hooks/share.ts`). Components never call the API directly — they use these hooks.

### Forms
All forms use TanStack Form with a Zod schema defined in `src/lib/`. The schema is passed to `validators: { onMount, onChange }` on the form. No field-level validators.

### Mock API layer
`src/api/mock/` contains mock implementations of every API function. Toggling `USE_MOCK=true` (or the relevant flag in `src/api/index.ts`) swaps the real API for mocks, useful for frontend development without a running backend.

### Filters as query params
All filter state (type, date range, sort order, active tab) is stored in URL query params via TanStack Router's `validateSearch`. This means filtered views are bookmarkable and shareable.

## Database schema (summary)

```
User
  ├── id, name, email, passwordHash
  ├── dob, bloodType, gender
  ├── role (patient | admin)
  ├── isOnboarded, lastLoginAt
  ├── passwordResetTokens[]
  └── shareLinks[]

Report
  ├── id, userId, type, title, date
  ├── doctorName, notes
  ├── files[]  (ReportFile)
  └── deletedAt  (soft delete)

ReportFile
  └── id, reportId, key, url, name, size

PasswordResetToken
  └── id, userId, token (unique), expiresAt, usedAt

ShareLink
  ├── id, userId, reportIds[]
  ├── label, token (unique)
  ├── expiresIn, expiresAt
  └── isRevoked
```
