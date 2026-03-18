---
name: meditrack-context
description: Master context for MediTrack — app overview, route map, data models, design tokens, and conventions. Load this first before any MediTrack task.
---

# MediTrack — Master Context

## What is MediTrack?

MediTrack is a patient facing app for digitally managing medical reports — replacing physical folders of paper hard copies. Users are non-tech-savvy patients of all ages, including elderly people. Every decision prioritises clarity, trust, forgiveness (no accidental irreversible actions), and mobile-first usability.

POC scope: auth, upload reports, timeline view, shareable links.

## Tech Stack

| Layer      | Choice                                                   |
| ---------- | -------------------------------------------------------- |
| Framework  | TanStack Start + TanStack Router (file-based routing)    |
| UI         | React 19                                                 |
| Styling    | Tailwind CSS v4                                          |
| Components | shadcn v4, `base-nova` style (built on `@base-ui/react`) |
| Language   | TypeScript strict mode                                   |
| Icons      | `lucide-react`                                           |
| Dates      | `date-fns`                                               |
| Forms      | `@tanstack/react-form` v1 + `zod` v4 — see `/meditrack-form` |
| Path alias | `#/` maps to `src/`                                      |

Key imports:

- `#/components/ui/*` — shadcn components (never edit these files)
- `#/lib/utils` — `cn()` utility (clsx + tailwind-merge)
- `#/hooks/use-mobile` — mobile breakpoint hook

## Route Map

```
src/routes/
├── __root.tsx               — HTML shell, TooltipProvider, fonts
├── index.tsx                — Root / landing redirect
├── $.tsx                    — 404 catch-all
│
├── _auth/                   — Pathless layout (unauthenticated)
│   ├── route.tsx            — Auth layout wrapper
│   ├── login.tsx            — /login
│   ├── signup.tsx           — /signup
│   ├── forgot-password.tsx  — /forgot-password
│   └── reset-password.tsx   — /reset-password
│
├── _app/                    — Pathless layout (authenticated)
│   ├── route.tsx            — App shell layout wrapper
│   ├── dashboard.tsx        — /dashboard
│   ├── timeline.tsx         — /timeline
│   ├── profile.tsx          — /profile
│   ├── settings.tsx         — /settings
│   ├── onboarding/
│   │   ├── profile.tsx      — /onboarding/profile
│   │   ├── first-upload.tsx — /onboarding/first-upload
│   │   └── done.tsx         — /onboarding/done
│   ├── reports/
│   │   ├── index.tsx        — /reports
│   │   ├── upload.tsx       — /reports/upload
│   │   └── $id/
│   │       ├── index.tsx    — /reports/$id
│   │       └── edit.tsx     — /reports/$id/edit
│   └── share/
│       ├── index.tsx        — /share
│       └── new.tsx          — /share/new
│
└── s/$token.tsx             — /s/$token — public shared view (no auth)
```

## Component Folder Structure

```
src/components/
├── ui/         — shadcn auto-generated — NEVER edit manually
├── shared/     — used in 2+ routes
│   └── layout/ — AppShell, Sidebar, Header, AuthLayout, etc.
├── auth/       — components for _auth/* routes only
└── app/        — components for _app/* routes
    ├── dashboard/
    ├── reports/
    ├── timeline/
    ├── onboarding/
    ├── share/
    └── settings/
```

- One route only → folder matching that route
- Two or more routes → `shared/`
- Filenames: `PascalCase.tsx`

## Data Models (frontend types only)

```typescript
type User = {
  id: string
  name: string
  email: string
  dob: string // ISO date
  bloodType: string // e.g. "A+", "O-"
  gender: string
  createdAt: string
}

type ReportType = 'blood_test' | 'xray' | 'prescription' | 'scan' | 'other'

type Report = {
  id: string
  userId: string
  type: ReportType
  title: string
  date: string // ISO date — the report date, not upload date
  doctorName: string
  notes: string
  files: string[] // file URLs
  createdAt: string
}

type ShareLink = {
  id: string
  userId: string
  reportIds: string[]
  label: string
  expiresAt: '24h' | '7d' | '30d' | 'one_time'
  token: string
  isRevoked: boolean
  createdAt: string
}
```

## Design Tokens (`src/styles.css`)

Always use semantic tokens — never raw colour classes like `bg-teal-500`.

| Token                                    | Use                                 |
| ---------------------------------------- | ----------------------------------- |
| `bg-background` / `text-foreground`      | Page base                           |
| `bg-card` / `text-card-foreground`       | Elevated surfaces                   |
| `bg-primary` / `text-primary-foreground` | Teal/green — primary actions only   |
| `bg-muted` / `text-muted-foreground`     | Disabled, helper, secondary text    |
| `bg-accent` / `text-accent-foreground`   | Hover/focus highlight surface       |
| `bg-destructive`                         | Errors, deletes, irreversible only  |
| `bg-sidebar` / `text-sidebar-foreground` | Sidebar surface                     |
| `border-border`                          | Default border                      |
| `border-input`                           | Form input border                   |
| `chart-1` → `chart-5`                    | Teal-family gradient, data viz only |

## Typography

- **`font-primary`** (Manrope) — all UI: labels, inputs, body, navigation, buttons
- **`font-serif`** (Playfair Display) — sparingly: page titles on auth/onboarding only
- Minimum meaningful text size: `text-base` (16px)
- Body copy: `leading-relaxed`

## Non-Negotiable Rules

- Route files stay under ~30 lines — no JSX logic, just import + compose
- `<Link>` from TanStack Router for all internal navigation — never raw `<a>`
- `useNavigate` from TanStack Router — never `window.location`
- No `any` types
- `import type` for type-only imports (`verbatimModuleSyntax` is on)
- No unused imports or variables
- Tailwind only — no inline styles
- Semantic tokens only — no raw colour classes
- Destructive actions require `AlertDialog` confirmation — never inline
- Icon-only buttons need `aria-label`
- Minimum touch target: `min-h-11 min-w-11` (44×44px)
