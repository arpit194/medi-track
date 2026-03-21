import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Route } from '#/routes/_auth/reset-password'
import { ResetPasswordForm } from './ResetPasswordForm'

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const { token } = Route.useSearch()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-serif text-3xl font-medium">{t('auth.resetPassword.heading')}</h1>
        <p className="text-muted-foreground leading-relaxed">
          {t('auth.resetPassword.description')}
        </p>
      </div>

      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-center text-muted-foreground">
          {t('auth.resetPassword.invalidLink')}{' '}
          <Link to="/forgot-password" className="font-medium text-foreground underline underline-offset-4">
            {t('auth.resetPassword.requestNewOne')}
          </Link>
        </p>
      )}

      <p className="text-center text-muted-foreground">
        {t('auth.resetPassword.rememberedIt')}{' '}
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
          {t('auth.resetPassword.backToSignIn')}
        </Link>
      </p>
    </div>
  )
}
