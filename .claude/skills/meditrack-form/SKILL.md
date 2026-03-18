---
name: meditrack-form
description: How to build forms in MediTrack — TanStack Form + Zod schema patterns, file structure, field template, submit button, cross-field validation, and server errors.
---

# MediTrack — Forms

## Stack

| Layer | Choice |
|---|---|
| Form state | `@tanstack/react-form` (TanStack Form v1) |
| Validation | `zod` v4 (Standard Schema — no adapter needed) |
| API calls | `@tanstack/react-query` mutations via hooks in `src/hooks/` |

---

## Schema files (`src/lib/`)

All schemas live in `src/lib/` — never define them inline in a form component.

Group related schemas in one file. Define field schemas first, then compose them into form schemas:

```ts
// src/lib/auth-schemas.ts
import { z } from 'zod'

// Field schemas — reusable building blocks
export const nameSchema = z.string().min(1, 'Please enter your full name.')
export const emailSchema = z
  .string()
  .min(1, 'Please enter your email address.')
  .refine(
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    'Please enter a valid email address, like name@example.com.',
  )
export const passwordSchema = z
  .string()
  .min(1, 'Please enter your password.')
  .min(8, 'Your password must be at least 8 characters.')

// Form schemas — composed from field schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please try again.',
    path: ['confirmPassword'],
  })
```

### Zod notes
- **Do not use `z.email()`** — TanStack's build tooling bundles Zod v3 internally; the SSR runner can accidentally resolve to it, where `z.email()` doesn't exist. Use `.refine()` with a regex instead (see `emailSchema` above)
- **Do not use `z.string().email()`** — deprecated in v4
- Use `z.string().min()` for required string fields
- Cross-field validation: use `.refine()` with a `path` array — never field-level function validators

---

## Form component structure

### 1 — Import the schema, set up the form

```ts
import { signupSchema } from '#/lib/auth-schemas'
import { useForm } from '@tanstack/react-form'

const form = useForm({
  defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  validators: { onChange: schema },
  onSubmit: async ({ value }) => {
    // call API with value
  },
})
```

- Pass the form-level schema to `validators: { onChange: schema }`
- No field-level validators — all validation belongs in the schema file
- `onSubmit` only fires when the schema passes

### 2 — Form element

```tsx
<form
  className="flex flex-col gap-5"
  onSubmit={(e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }}
  noValidate
>
```

Always `noValidate` — we own validation, not the browser.

### 3 — Field template

Every field follows this exact structure:

```tsx
<form.Field name="email">
  {(field) => (
    <Field>
      <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
      <Input
        id={field.name}
        type="email"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder="you@example.com"
        autoComplete="email"
        className="h-11"
        aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
        aria-describedby={
          field.state.meta.isTouched && field.state.meta.errors.length > 0
            ? 'email-error'
            : undefined
        }
      />
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <FieldError
          id="email-error"
          errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
        />
      )}
    </Field>
  )}
</form.Field>
```

Key rules:
- `id={field.name}` — ties label to input
- Errors only show when `isTouched` — no red text on first render
- `aria-invalid` and `aria-describedby` are always set for accessibility
- Error ID must match `aria-describedby` (e.g. `'email-error'`)
- Wrap all fields in `<FieldGroup>` for consistent spacing

### 4 — Submit button

Always use `form.Subscribe` — never track `isSubmitting` with external state:

```tsx
<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
  {([canSubmit, isSubmitting]) => (
    <Button
      type="submit"
      size="lg"
      className="w-full"
      disabled={!canSubmit || !!isSubmitting}
    >
      {isSubmitting ? 'Saving…' : 'Save'}
    </Button>
  )}
</form.Subscribe>
```

- `canSubmit` is false when any schema validator is failing
- `size="lg"` on auth/onboarding CTAs — larger tap target

### 5 — API calls and server errors

Use a mutation hook from `src/hooks/` — never call the API directly from a form component. The mutation's state replaces `useState` for server errors:

```tsx
import { useLoginMutation } from '#/hooks/auth'
import { getErrorMessage } from '#/api/client'

const loginMutation = useLoginMutation()

// wire into TanStack Form:
const form = useForm({
  onSubmit: async ({ value }) => {
    try {
      await loginMutation.mutateAsync(value)
      await navigate({ to: '/dashboard' })
    } catch {
      // error state handled by loginMutation.isError — no rethrow needed
    }
  },
})

// in JSX — above the fields:
{loginMutation.isError && (
  <Alert variant="destructive">
    <OctagonXIcon className="size-4" />
    <AlertTitle>Something went wrong</AlertTitle>
    <AlertDescription>{getErrorMessage(loginMutation.error)}</AlertDescription>
  </Alert>
)}
```

For success-only states (e.g. forgot password confirmation), use `mutation.isSuccess` instead of a `useState<boolean>`:

```tsx
if (forgotPasswordMutation.isSuccess) {
  return <SuccessView />
}
```

Rules:
- Never use `useState` for server errors — use `mutation.isError` + `mutation.error`
- Never use `useState` for success state — use `mutation.isSuccess`
- `getErrorMessage(error)` from `#/api/client` extracts a human-readable string from any error
- Mutation errors clear automatically when the user retries

---

## Imports reference

```ts
import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { OctagonXIcon } from 'lucide-react'
```

---

## What never to do

- Define schemas inside form components — all schemas go in `src/lib/`
- Use field-level `validators` — use form-level `validators: { onChange: schema }` instead
- Use function validators for cross-field checks — use `.refine()` in the schema
- Track `isSubmitting` with `useState` — use `form.Subscribe`
- Use `z.string().email()` — use `z.email()` (Zod v4)
- Skip `noValidate` on the form element