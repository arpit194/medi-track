import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export function ForgotPasswordPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-serif text-3xl font-medium">{t('auth.forgotPassword.heading')}</h1>
        <p className="text-muted-foreground leading-relaxed">
          {t('auth.forgotPassword.description')}
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-muted-foreground">
        {t('auth.forgotPassword.rememberedIt')}{' '}
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
          {t('auth.forgotPassword.backToSignIn')}
        </Link>
      </p>
    </div>
  )
}
