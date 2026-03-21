import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { OctagonXIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createAuthSchemas } from '#/lib/auth-schemas'
import { getErrorMessage } from '#/api/client'
import { useSignupMutation } from '#/hooks/auth'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'

export function SignupForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const signupMutation = useSignupMutation()
  const { signupSchema } = createAuthSchemas(t)

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    validators: { onChange: signupSchema },
    onSubmit: async ({ value }) => {
      try {
        const { confirmPassword: _, ...signupData } = value
        await signupMutation.mutateAsync(signupData)
        await navigate({ to: '/onboarding/profile' })
      } catch {
        // error displayed via signupMutation.isError
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
      {signupMutation.isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>{t('common.somethingWentWrong')}</AlertTitle>
          <AlertDescription>
            {getErrorMessage(signupMutation.error)}
          </AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <form.Field name="name">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{t('auth.signup.nameLabel')}</FieldLabel>
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={t('auth.signup.namePlaceholder')}
                autoComplete="name"
                className="h-11"
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                aria-describedby={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? 'name-error'
                    : undefined
                }
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <FieldError
                  id="name-error"
                  errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
                />
              )}
            </Field>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{t('auth.signup.emailLabel')}</FieldLabel>
              <Input
                id={field.name}
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={t('auth.signup.emailPlaceholder')}
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
              <FieldLabel htmlFor={field.name}>{t('auth.signup.passwordLabel')}</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={t('auth.signup.passwordPlaceholder')}
                autoComplete="new-password"
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

        <form.Field name="confirmPassword">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{t('auth.signup.confirmPasswordLabel')}</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                autoComplete="new-password"
                className="h-11"
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                aria-describedby={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? 'confirm-password-error'
                    : undefined
                }
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <FieldError
                  id="confirm-password-error"
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
            {isSubmitting ? t('auth.signup.creatingAccount') : t('auth.signup.createAccount')}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
