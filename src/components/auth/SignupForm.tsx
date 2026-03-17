import { useState } from 'react'
import { OctagonXIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'

type FormErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  const name = (data.get('name') as string).trim()
  const email = (data.get('email') as string).trim()
  const password = data.get('password') as string
  const confirmPassword = data.get('confirmPassword') as string

  if (!name) errors.name = 'Please enter your full name.'
  if (!email) {
    errors.email = 'Please enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address, like name@example.com.'
  }
  if (!password) {
    errors.password = 'Please enter a password.'
  } else if (password.length < 8) {
    errors.password = 'Your password must be at least 8 characters.'
  }
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match. Please try again.'
  }

  return errors
}

export function SignupForm() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)

    const data = new FormData(e.currentTarget)
    const errs = validate(data)

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      // TODO: call signup API
    } catch {
      setServerError(
        "We couldn't create your account. Please check your connection and try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Saloni Patidar"
            autoComplete="name"
            className="h-11"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          <FieldError id="name-error" errors={[{ message: errors.name }]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          <FieldError id="email-error" errors={[{ message: errors.email }]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="h-11"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <FieldError
            id="password-error"
            errors={[{ message: errors.password }]}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            className="h-11"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? 'confirm-password-error' : undefined
            }
          />
          <FieldError
            id="confirm-password-error"
            errors={[{ message: errors.confirmPassword }]}
          />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
