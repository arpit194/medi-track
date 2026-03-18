import { useForm } from '@tanstack/react-form'
import { OctagonXIcon, CircleCheckIcon } from 'lucide-react'
import { changePasswordSchema } from '#/lib/settings-schemas'
import { getErrorMessage } from '#/api/client'
import { useChangePasswordMutation } from '#/hooks/user'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'

export function ChangePasswordForm() {
  const changePassword = useChangePasswordMutation()

  const form = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validators: { onChange: changePasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await changePassword.mutateAsync({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        })
        form.reset()
      } catch {
        // error shown via changePassword.isError
      }
    },
  })

  if (changePassword.isSuccess) {
    return (
      <Alert>
        <CircleCheckIcon className="size-4" />
        <AlertTitle>Password updated</AlertTitle>
        <AlertDescription>Your password has been changed successfully.</AlertDescription>
      </Alert>
    )
  }

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
      {changePassword.isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>Couldn't update password</AlertTitle>
          <AlertDescription>{getErrorMessage(changePassword.error)}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <form.Field name="currentPassword">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="current-password"
                className="h-11"
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                aria-describedby={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? 'currentPassword-error'
                    : undefined
                }
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <FieldError
                  id="currentPassword-error"
                  errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
                />
              )}
            </Field>
          )}
        </form.Field>

        <form.Field name="newPassword">
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
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                aria-describedby={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? 'newPassword-error'
                    : undefined
                }
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <FieldError
                  id="newPassword-error"
                  errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
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
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                aria-describedby={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? 'confirmPassword-error'
                    : undefined
                }
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <FieldError
                  id="confirmPassword-error"
                  errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
                />
              )}
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={!canSubmit || !!isSubmitting}
          >
            {isSubmitting ? 'Updating…' : 'Update password'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
