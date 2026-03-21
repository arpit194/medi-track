import { useForm } from '@tanstack/react-form'
import { MailIcon, OctagonXIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createAuthSchemas } from '#/lib/auth-schemas'
import { getErrorMessage } from '#/api/client'
import { useForgotPasswordMutation } from '#/hooks/auth'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const forgotPasswordMutation = useForgotPasswordMutation()
  const { forgotPasswordSchema } = createAuthSchemas(t)

  const form = useForm({
    defaultValues: { email: '' },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await forgotPasswordMutation.mutateAsync(value)
      } catch {
        // error displayed via forgotPasswordMutation.isError
      }
    },
  })

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl bg-muted p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <MailIcon className="size-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-foreground">{t('auth.forgotPassword.successHeading')}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('auth.forgotPassword.successMessage')}
          </p>
        </div>
      </div>
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
      {forgotPasswordMutation.isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>{t('common.somethingWentWrong')}</AlertTitle>
          <AlertDescription>
            {getErrorMessage(forgotPasswordMutation.error)}
          </AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <form.Field name="email">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>{t('auth.forgotPassword.emailLabel')}</FieldLabel>
              <Input
                id={field.name}
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
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
      </FieldGroup>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!canSubmit || !!isSubmitting}
          >
            {isSubmitting ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendResetLink')}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
