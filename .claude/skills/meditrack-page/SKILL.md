---
name: meditrack-page
description: Scaffold a new page in MediTrack. Covers route file format, layout group selection, component folder placement, and naming conventions.
argument-hint: <route path, e.g. /_app/reports/upload>
---

# MediTrack — Scaffolding a New Page

## Step 1 — Choose the Right Layout Group

| Route type                                | Layout group | File prefix         |
| ----------------------------------------- | ------------ | ------------------- |
| Unauthenticated (login, signup, password) | `_auth`      | `src/routes/_auth/` |
| Authenticated app pages                   | `_app`       | `src/routes/_app/`  |
| Public token-based view                   | `s/`         | `src/routes/s/`     |

## Step 2 — Create the Route File (thin wrapper only)

Route files are under ~30 lines. They register the route and import the page component — nothing else

### `_app` page

```typescript
// src/routes/_app/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '#/components/app/dashboard/DashboardPage'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})
```

### `_app` nested page

```typescript
// src/routes/_app/reports/upload.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UploadReportPage } from '#/components/app/reports/UploadReportPage'

export const Route = createFileRoute('/_app/reports/upload')({
  component: UploadReportPage,
})
```

### `_app` dynamic segment

```typescript
// src/routes/_app/reports/$id/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ReportDetailPage } from '#/components/app/reports/ReportDetailPage'

export const Route = createFileRoute('/_app/reports/$id/')({
  component: ReportDetailPage,
})
```

### `_auth` page

```typescript
// src/routes/_auth/login.tsx
import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '#/components/auth/LoginPage'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})
```

## Step 3 — Create the Page Component

Component lives in the folder mirroring the route path.

| Route                    | Component path                                     |
| ------------------------ | -------------------------------------------------- |
| `/_app/dashboard`        | `src/components/app/dashboard/DashboardPage.tsx`   |
| `/_app/reports`          | `src/components/app/reports/ReportsPage.tsx`       |
| `/_app/reports/upload`   | `src/components/app/reports/UploadReportPage.tsx`  |
| `/_app/reports/$id`      | `src/components/app/reports/ReportDetailPage.tsx`  |
| `/_app/reports/$id/edit` | `src/components/app/reports/EditReportPage.tsx`    |
| `/_app/timeline`         | `src/components/app/timeline/TimelinePage.tsx`     |
| `/_app/share`            | `src/components/app/share/ShareLinksPage.tsx`      |
| `/_app/share/new`        | `src/components/app/share/CreateShareLinkPage.tsx` |
| `/_app/settings`         | `src/components/app/settings/SettingsPage.tsx`     |
| `/_auth/login`           | `src/components/auth/LoginPage.tsx`                |
| `/_auth/signup`          | `src/components/auth/SignupPage.tsx`               |
| `/s/$token`              | `src/components/shared/SharedReportPage.tsx`       |

### Minimal page component shell

```typescript
export function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-4xl mx-auto">
      {/* sections */}
    </div>
  )
}
```

### Loading skeleton variant (only when the page loads async data)

Create a skeleton only if the page has a route `loader` or fires queries that need to resolve before content appears. Pure form pages (auth, onboarding) do not need skeletons.

```typescript
import { Skeleton } from '#/components/ui/skeleton'

export function DashboardPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 w-full max-w-4xl mx-auto">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
```

## Step 4 — Naming Conventions

| Thing            | Convention                                          |
| ---------------- | --------------------------------------------------- |
| Route file       | `kebab-case.tsx`                                    |
| Dynamic segment  | `$paramName` (e.g. `$id`, `$token`)                 |
| Page component   | `PascalCase` + `Page` suffix (e.g. `DashboardPage`) |
| Skeleton variant | Same name + `Skeleton` suffix                       |
| Component folder | lowercase, matches route segment                    |

## Step 5 — Internal Navigation

Always use TanStack Router — never raw `<a>` or `window.location`.

```typescript
import { Link, useNavigate } from '@tanstack/react-router'

// Declarative link
<Link to="/reports/$id" params={{ id: report.id }}>View report</Link>

// Programmatic navigation
const navigate = useNavigate()
navigate({ to: '/dashboard' })
navigate({ to: '/reports', search: { filter: 'blood_test' } })
```

## Step 6 — Page Layout Rules

- Outer div: always `flex flex-1 flex-col w-full` — this ensures the page fills the flex container and child empty states can grow vertically
- Max width: `max-w-4xl` or `max-w-2xl` for forms, centred with `mx-auto`
- Padding: `p-4 md:p-6` (mobile-first)
- Vertical spacing between sections: `gap-6`
- Cards use minimum `p-6` internal padding via `CardContent`
- Page heading: `font-serif text-2xl font-medium` (used sparingly — one per page)

## Checklist

- [ ] Route file is under ~30 lines with no inline JSX
- [ ] `createFileRoute` string exactly matches the file path
- [ ] Page component is in the correct `src/components/` subfolder
- [ ] Skeleton variant exists alongside the page component (only if it loads async data)
- [ ] All internal links use `<Link>` from TanStack Router
- [ ] Page has `max-w-*`, `mx-auto`, and correct padding
