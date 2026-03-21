import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { SignupForm } from './SignupForm'

export function SignupPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-serif text-3xl font-medium">{t('auth.signup.heading')}</h1>
        <p className="text-muted-foreground leading-relaxed">
          {t('auth.signup.description')}
        </p>
      </div>

      <SignupForm />

      <p className="text-center text-muted-foreground">
        {t('auth.signup.alreadyHaveAccount')}{' '}
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
          {t('auth.signup.signIn')}
        </Link>
      </p>
    </div>
  )
}
