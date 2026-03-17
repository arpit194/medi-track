---
name: meditrack-component
description: Build UI components for MediTrack. Covers shadcn usage, colour tokens, report type badges, empty states, loading states, and destructive confirmations.
argument-hint: <component name or feature>
---

# MediTrack — Building UI Components

## Core Principles

Users are patients — often elderly, often anxious about their medical data. Components must:
- Communicate state clearly without relying on colour alone (pair with text or icon)
- Give enough breathing room to reduce cognitive load
- Never show blank areas while loading — always use Skeleton
- Always tell users what to do next in empty states

## shadcn Components (in `src/components/ui/`)

Never edit files in `ui/`. Import from `#/components/ui/<name>`.

Key components for MediTrack:

| Component | File | Use |
|---|---|---|
| `Button` | `button.tsx` | All interactive triggers |
| `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription`, `CardAction` | `card.tsx` | Content surfaces |
| `Badge` | `badge.tsx` | Report type labels, status chips |
| `Skeleton` | `skeleton.tsx` | Loading states |
| `Empty`, `EmptyHeader`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`, `EmptyMedia` | `empty.tsx` | Empty states |
| `AlertDialog` + sub-components | `alert-dialog.tsx` | Destructive confirmations (delete, revoke) |
| `Dialog` + sub-components | `dialog.tsx` | Non-destructive modals |
| `Separator` | `separator.tsx` | Visual dividers |
| `Tooltip`, `TooltipTrigger`, `TooltipContent` | `tooltip.tsx` | Icon button labels |
| `Avatar`, `AvatarImage`, `AvatarFallback` | `avatar.tsx` | User profile images |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `tabs.tsx` | Section switching |
| `ScrollArea` | `scroll-area.tsx` | Constrained scrollable regions |

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

Forms are high-stakes for MediTrack users — assume no prior app experience. Every form must be clear, forgiving, and self-explanatory.

### Core Pattern: Field + Label + Error

Use the `Field` component system from `src/components/ui/field.tsx` for every form field.

```typescript
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup } from '#/components/ui/field'
import { Input } from '#/components/ui/input'

<FieldGroup>
  <Field>
    <FieldLabel htmlFor="doctor-name">Doctor's name</FieldLabel>
    <Input
      id="doctor-name"
      name="doctorName"
      type="text"
      placeholder="e.g. Dr. Priya Sharma"
      aria-invalid={!!errors.doctorName}
      aria-describedby={errors.doctorName ? 'doctor-name-error' : undefined}
    />
    <FieldError id="doctor-name-error" errors={[errors.doctorName]} />
  </Field>
</FieldGroup>
```

- Always use a visible `<FieldLabel>` — never placeholder-only labels
- Always pair `id` on the input with `htmlFor` on the label
- `aria-invalid` triggers the red ring via the input's `aria-invalid:` Tailwind variant
- `aria-describedby` links the input to its error for screen readers
- `FieldError` returns `null` automatically when there is no error — no conditional needed
- `FieldDescription` adds helper text beneath the label for ambiguous fields

### Select Fields

```typescript
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '#/components/ui/select'
import { Field, FieldLabel, FieldError } from '#/components/ui/field'

<Field>
  <FieldLabel htmlFor="report-type">Report type</FieldLabel>
  <Select name="type" defaultValue="other">
    <SelectTrigger id="report-type" className="w-full" aria-invalid={!!errors.type}>
      <SelectValue placeholder="Choose a type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="blood_test">Blood test</SelectItem>
      <SelectItem value="xray">X-Ray</SelectItem>
      <SelectItem value="prescription">Prescription</SelectItem>
      <SelectItem value="scan">Scan</SelectItem>
      <SelectItem value="other">Other</SelectItem>
    </SelectContent>
  </Select>
  <FieldError errors={[errors.type]} />
</Field>
```

Labels must match user vocabulary — "Blood test" not "blood_test", "X-Ray" not "xray".

### Textarea Fields

```typescript
import { Textarea } from '#/components/ui/textarea'

<Field>
  <FieldLabel htmlFor="notes">
    Notes <span className="text-muted-foreground font-normal">(optional)</span>
  </FieldLabel>
  <FieldDescription>Any details you want to remember about this report</FieldDescription>
  <Textarea id="notes" name="notes" placeholder="e.g. fasting required, follow-up in 3 months" rows={3} />
  <FieldError errors={[errors.notes]} />
</Field>
```

Optional fields must always be labelled "(optional)" — never assume users will guess.

### Radio Groups

```typescript
import { FieldSet, FieldLegend } from '#/components/ui/field'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'

<FieldSet>
  <FieldLegend>Link expiry</FieldLegend>
  <RadioGroup name="expiresAt" defaultValue="7d">
    <Field orientation="horizontal">
      <RadioGroupItem value="24h" id="expires-24h" />
      <FieldLabel htmlFor="expires-24h">24 hours</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem value="7d" id="expires-7d" />
      <FieldLabel htmlFor="expires-7d">7 days</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem value="30d" id="expires-30d" />
      <FieldLabel htmlFor="expires-30d">30 days</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem value="one_time" id="expires-one-time" />
      <FieldLabel htmlFor="expires-one-time">One time only</FieldLabel>
    </Field>
  </RadioGroup>
  <FieldError errors={[errors.expiresAt]} />
</FieldSet>
```

### Error Message Writing Rules

| Bad | Good |
|---|---|
| "Required" | "Please enter the doctor's name" |
| "Invalid date" | "Please enter the date shown on the report" |
| "Invalid email" | "Please enter a valid email address, like name@example.com" |
| "File too large" | "This file is too large. Please upload a file under 10 MB." |
| "Error occurred" | "We couldn't save your report. Please check your connection and try again." |

Tone: calm, specific, actionable. Never blame the user.

### Submit Button Pattern

```typescript
// Auth / onboarding — large, full width
<Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
  {isSubmitting ? 'Signing in…' : 'Sign in'}
</Button>

// In-app form
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Saving…' : 'Save report'}
</Button>

// With cancel
<div className="flex gap-3 justify-end">
  <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Saving…' : 'Save'}
  </Button>
</div>
```

- `size="lg"` + `w-full` only on auth and onboarding forms
- Show loading text during submission — never just a spinner
- Disable while submitting to prevent double-submits — never hide the button

### Inline Error vs Toast

| Situation | Use |
|---|---|
| Field validation failed | `FieldError` inline beneath the field |
| Whole-form server error | `Alert variant="destructive"` above the submit button |
| Action succeeded | `toast.success()` from `sonner` |

Never use `toast.error()` as the only feedback for a form submission — users need inline errors to know what to fix.

### Form Wrapper

```typescript
// In-app form — wrap in Card
<Card>
  <CardHeader><CardTitle>Upload a report</CardTitle></CardHeader>
  <CardContent>
    <form className="flex flex-col gap-5">
      <FieldGroup>{/* fields */}</FieldGroup>
    </form>
  </CardContent>
  <CardFooter><Button type="submit">Upload</Button></CardFooter>
</Card>

// Auth page — plain div, no card
<div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
  <h1 className="font-serif text-3xl text-center">Welcome back</h1>
  <form className="flex flex-col gap-5">
    <FieldGroup>{/* fields */}</FieldGroup>
    <Button type="submit" size="lg" className="w-full">Sign in</Button>
  </form>
</div>
```

## Accessibility Checklist

- [ ] Icon-only buttons have `aria-label`
- [ ] Colour is never the only indicator of state — pair with text or icon
- [ ] Custom interactive elements: `min-h-11 min-w-11` touch targets
- [ ] No `text-xs` for anything a user must read to act
- [ ] Focus rings visible (shadcn components include these — don't override `outline-none`)
- [ ] Every input has a visible `<FieldLabel>` with matching `htmlFor` / `id`
- [ ] `aria-invalid="true"` on inputs with errors
- [ ] `aria-describedby` links input to its `FieldError`
- [ ] Submit button disabled (not hidden) while submitting
- [ ] Optional fields labelled "(optional)"
- [ ] Radio/checkbox groups use `FieldSet` + `FieldLegend`
- [ ] Input height at least `h-11` on touch-heavy forms