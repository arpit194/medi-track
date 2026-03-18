---
name: meditrack-component
description: Build UI components for MediTrack. Covers shadcn usage, colour tokens, report type badges, empty states, loading states, and destructive confirmations.
argument-hint: <component name or feature>
---

# MediTrack — Building UI Components

## Core Principles

Users are patients — often time elderly, often anxious about their medical data. Components must:

- Communicate state clearly without relying on colour alone (pair with text or icon)
- Give enough breathing room to reduce cognitive load
- Never show blank areas while loading — always use Skeleton
- Always tell users what to do next in empty states

## shadcn Components (in `src/components/ui/`)

Never edit files in `ui/`. Import from `#/components/ui/<name>`.

Key components for MediTrack:

| Component                                                                                       | File               | Use                                        |
| ----------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------ |
| `Button`                                                                                        | `button.tsx`       | All interactive triggers                   |
| `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription`, `CardAction` | `card.tsx`         | Content surfaces                           |
| `Badge`                                                                                         | `badge.tsx`        | Report type labels, status chips           |
| `Skeleton`                                                                                      | `skeleton.tsx`     | Loading states                             |
| `Empty`, `EmptyHeader`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`, `EmptyMedia`          | `empty.tsx`        | Empty states                               |
| `AlertDialog` + sub-components                                                                  | `alert-dialog.tsx` | Destructive confirmations (delete, revoke) |
| `Dialog` + sub-components                                                                       | `dialog.tsx`       | Non-destructive modals                     |
| `Separator`                                                                                     | `separator.tsx`    | Visual dividers                            |
| `Tooltip`, `TooltipTrigger`, `TooltipContent`                                                   | `tooltip.tsx`      | Icon button labels                         |
| `Avatar`, `AvatarImage`, `AvatarFallback`                                                       | `avatar.tsx`       | User profile images                        |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`                                                | `tabs.tsx`         | Section switching                          |
| `ScrollArea`                                                                                    | `scroll-area.tsx`  | Constrained scrollable regions             |

## Colour Token Rules

Never use raw Tailwind colour utilities (`bg-teal-500`, `text-gray-600`). Semantic tokens only.

```typescript
// Wrong
<div className="bg-teal-500 text-gray-600">

// Correct
<div className="bg-primary text-primary-foreground">
<p className="text-muted-foreground">
```

Quick reference:

- **Page base**: `bg-background text-foreground`
- **Raised surface**: `bg-card text-card-foreground`
- **Subtle/muted**: `bg-muted text-muted-foreground`
- **Primary CTA**: `bg-primary text-primary-foreground`
- **Danger**: use `variant="destructive"` on Button/Badge — don't add `bg-destructive` manually
- **Borders**: `border-border` (default), `border-input` (form fields)

## Button Conventions

```typescript
import { Button } from '#/components/ui/button'

// Primary CTA on auth/onboarding — large, full width
<Button size="lg" className="w-full">Get started</Button>

// Primary CTA inside the app
<Button>Upload report</Button>

// Secondary / cancel
<Button variant="outline">Cancel</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Icon-only — always needs aria-label + min touch target
<Button size="icon" aria-label="Delete report" className="min-h-11 min-w-11">
  <Trash2Icon className="size-4" />
</Button>

// Low-emphasis in lists
<Button variant="ghost" size="sm">Edit</Button>
```

## Report Type Badge

Single source of truth for report type colours — reuse `ReportTypeBadge` everywhere.

```typescript
// src/components/shared/ReportTypeBadge.tsx
import { Badge } from '#/components/ui/badge'

type ReportType = 'blood_test' | 'xray' | 'prescription' | 'scan' | 'other'

const REPORT_TYPE_CONFIG: Record<ReportType, { label: string; className: string }> = {
  blood_test:   { label: 'Blood test',   className: 'bg-chart-1/20 text-chart-5 border-chart-2/30' },
  xray:         { label: 'X-Ray',        className: 'bg-secondary text-secondary-foreground' },
  prescription: { label: 'Prescription', className: 'bg-primary/10 text-primary border-primary/20' },
  scan:         { label: 'Scan',         className: 'bg-accent text-accent-foreground' },
  other:        { label: 'Other',        className: 'bg-muted text-muted-foreground' },
}

export function ReportTypeBadge({ type }: { type: ReportType }) {
  const config = REPORT_TYPE_CONFIG[type]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
```

Use `ReportTypeBadge` in: reports list, timeline, report detail, share summary, upload form.

## Card Pattern

Cards use `ring-1 ring-foreground/10` internally — do not add `border` classes to cards.

```typescript
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter, CardAction,
} from '#/components/ui/card'
import { format } from 'date-fns'

function ReportCard({ report }: { report: Report }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{report.title}</CardTitle>
        <CardDescription>{report.doctorName}</CardDescription>
        <CardAction>
          <ReportTypeBadge type={report.type} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-base text-muted-foreground leading-relaxed">
          {report.notes}
        </p>
      </CardContent>
      <CardFooter>
        <span className="text-sm text-muted-foreground">
          {format(new Date(report.date), 'dd MMM yyyy')}
        </span>
      </CardFooter>
    </Card>
  )
}
```

## Empty State Pattern

Always include what to do next. Use the `Empty` shadcn component.

```typescript
import {
  Empty, EmptyHeader, EmptyMedia,
  EmptyTitle, EmptyDescription, EmptyContent,
} from '#/components/ui/empty'
import { Button } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'
import { FolderOpenIcon } from 'lucide-react'

function NoReportsEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpenIcon />
        </EmptyMedia>
        <EmptyTitle>No reports yet</EmptyTitle>
        <EmptyDescription>
          Your medical reports will appear here once you upload them.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link to="/reports/upload">Upload your first report</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
```

Rules:

- Title states what is missing (not "Nothing here")
- Description is warm and explains what to do — no jargon, no apology
- Always include a clear action if there's a way to fill the empty state

## Loading State Pattern

Match the shape of the content that will appear.

```typescript
import { Skeleton } from '#/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '#/components/ui/card'

function ReportCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  )
}

function ReportsListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <ReportCardSkeleton key={i} />
      ))}
    </div>
  )
}
```

## Error State Pattern

Inline alert for section-level errors. Use `text-destructive` for error text — never add raw `bg-red-*`.

```typescript
import { Alert, AlertTitle, AlertDescription } from '#/components/ui/alert'
import { OctagonXIcon } from 'lucide-react'

function SectionError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <OctagonXIcon className="size-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>{message} Please try again.</AlertDescription>
    </Alert>
  )
}
```

## Destructive Confirmation Pattern

Delete / revoke actions always require `AlertDialog` — never inline confirm.

```typescript
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '#/components/ui/alert-dialog'
import { Button } from '#/components/ui/button'

function DeleteReportButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">Delete report</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this report?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the report and all its files. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Forms

For form state, validation, field template, submit button, and server error patterns — use `/meditrack-form`.

### Error message tone

| Bad              | Good                                                                        |
| ---------------- | --------------------------------------------------------------------------- |
| "Required"       | "Please enter the doctor's name."                                           |
| "Invalid date"   | "Please enter the date shown on the report."                                |
| "Invalid email"  | "Please enter a valid email address, like name@example.com."                |
| "File too large" | "This file is too large. Please upload a file under 10 MB."                 |
| "Error occurred" | "We couldn't save your report. Please check your connection and try again." |

Calm, specific, actionable — never blame the user.

### Inline error vs toast

| Situation               | Use                                                     |
| ----------------------- | ------------------------------------------------------- |
| Field validation failed | `FieldError` inline beneath the field                   |
| Whole-form server error | `Alert variant="destructive"` above the fields          |
| Action succeeded        | `toast.success()` via Sonner                            |

Never use `toast.error()` as the only feedback for a form submission.

## Accessibility Checklist

- [ ] Icon-only buttons have `aria-label`
- [ ] Colour is never the only indicator of state — pair with text or icon
- [ ] All interactive elements: `min-h-11 min-w-11` minimum touch target
- [ ] No `text-xs` for anything a user must read to act
- [ ] Focus rings visible — don't override `outline-none` on shadcn components
- [ ] Submit button disabled (not hidden) while submitting
