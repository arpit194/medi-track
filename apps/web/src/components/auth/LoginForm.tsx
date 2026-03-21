import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { OctagonXIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createAuthSchemas } from '#/lib/auth-schemas'
import { getErrorMessage } from '#/api/client'
import { useLoginMutation } from '#/hooks/auth'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'

export function LoginForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()
  const { loginSchema } = createAuthSchemas(t)

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        const { user } = await loginMutation.mutateAsync(value)
        await navigate({ to: user.isOnboarded ? '/dashboard' : '/onboarding/profile' })
      } catch {
        // error displayed via loginMutation.isError
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
      {loginMutation.isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>{t('common.somethingWentWrong')}</AlertTitle>
          <AlertDescription>
            {getErrorMessage(loginMutation.error)}
          </AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <form.Field name="email">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{t('auth.login.emailLabel')}</FieldLabel>
              <Input
                id={field.name}
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={t('auth.login.emailPlaceholder')}
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

        <form.Field name="password">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{t('auth.login.passwordLabel')}</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={t('auth.login.passwordPlaceholder')}
                autoComplete="current-password"
                className="h-11"
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                aria-describedby={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? 'password-error'
                    : undefined
                }
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <FieldError
                  id="password-error"
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
            size="lg"
            className="w-full"
            disabled={!canSubmit || !!isSubmitting}
          >
            {isSubmitting ? t('auth.login.signingIn') : t('auth.login.signIn')}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
