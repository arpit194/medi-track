import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LoginForm } from './LoginForm'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-serif text-3xl font-medium">{t('auth.login.heading')}</h1>
        <p className="text-muted-foreground leading-relaxed">
          {t('auth.login.description')}
        </p>
      </div>

      <LoginForm />

      <div className="flex flex-col gap-2 text-center text-muted-foreground">
        <p>
          {t('auth.login.noAccount')}{' '}
          <Link
            to="/signup"
            className="font-medium text-foreground underline underline-offset-4"
          >
            {t('auth.login.createOne')}
          </Link>
        </p>
        <p>
          <Link
            to="/forgot-password"
            className="font-medium text-foreground underline underline-offset-4"
          >
            {t('auth.login.forgotPassword')}
          </Link>
        </p>
      </div>
    </div>
  )
}
