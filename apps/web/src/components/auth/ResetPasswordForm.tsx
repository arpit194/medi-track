import { useForm } from '@tanstack/react-form'
import { OctagonXIcon } from 'lucide-react'
import { resetPasswordSchema } from '#/lib/auth-schemas'
import { getErrorMessage } from '#/api/client'
import { useResetPasswordMutation } from '#/hooks/auth'
import { useNavigate } from '@tanstack/react-router'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'

type Props = {
  token: string
}

export function ResetPasswordForm({ token }: Props) {
  const resetPasswordMutation = useResetPasswordMutation()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { password: '', confirmPassword: '' },
    validators: { onChange: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await resetPasswordMutation.mutateAsync({
          token,
          password: value.password,
        })
        await navigate({ to: '/login' })
      } catch {
        // error displayed via resetPasswordMutation.isError
      }
    },
  })

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      noValidate
    >
      {resetPasswordMutation.isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {getErrorMessage(resetPasswordMutation.error)}
          </AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <form.Field name="password">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>New password</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="new-password"
                className="h-11"
                aria-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
                aria-describedby={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? 'password-error'
                    : undefined
                }
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <FieldError
                    id="password-error"
                    errors={field.state.meta.errors.map((e) => ({
                      message: e?.message,
                    }))}
                  />
                )}
            </Field>
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="new-password"
                className="h-11"
                aria-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
                aria-describedby={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? 'confirmPassword-error'
                    : undefined
                }
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <FieldError
                    id="confirmPassword-error"
                    errors={field.state.meta.errors.map((e) => ({
                      message: e?.message,
                    }))}
                  />
                )}
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!canSubmit || !!isSubmitting}
          >
            {isSubmitting ? 'Saving…' : 'Set new password'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
