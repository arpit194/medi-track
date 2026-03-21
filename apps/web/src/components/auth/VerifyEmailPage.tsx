import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { buttonVariants } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { Route } from '#/routes/verify-email'
import { useVerifyEmailMutation } from '#/hooks/auth'

export function VerifyEmailPage() {
  const { t } = useTranslation()
  const { token } = Route.useSearch()
  const { mutate, isPending, isSuccess, isError } = useVerifyEmailMutation()

  useEffect(() => {
    if (token) mutate(token)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-svh flex items-center justify-center bg-background p-6">
    <div className="flex flex-col items-center gap-6 text-center w-full max-w-sm">
      {!isSuccess && !isError && (
        <>
          <Skeleton className="size-16 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-48 mx-auto" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </div>
        </>
      )}

      {isSuccess && (
        <>
          <CheckCircleIcon className="size-16 text-primary" />
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-3xl font-medium">{t('auth.verifyEmail.successHeading')}</h1>
            <p className="text-muted-foreground leading-relaxed">{t('auth.verifyEmail.successDescription')}</p>
          </div>
          <Link to="/dashboard" className={buttonVariants({ size: 'lg' })}>
            {t('auth.verifyEmail.successAction')}
          </Link>
        </>
      )}

      {isError && (
        <>
          <XCircleIcon className="size-16 text-destructive" />
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-3xl font-medium">{t('auth.verifyEmail.errorHeading')}</h1>
            <p className="text-muted-foreground leading-relaxed">{t('auth.verifyEmail.errorDescription')}</p>
          </div>
          <Link to="/login" className={buttonVariants({ variant: 'outline' })}>
            {t('auth.login.signIn', { defaultValue: 'Back to sign in' })}
          </Link>
        </>
      )}
    </div>
    </div>
  )
}
