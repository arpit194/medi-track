import { useState } from 'react'
import { MailIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useUser } from '#/hooks/user'
import { useResendVerificationMutation } from '#/hooks/auth'
import { getErrorMessage } from '#/api/client'

export function EmailVerificationBanner() {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const resendMutation = useResendVerificationMutation()
  const [sent, setSent] = useState(false)

  if (!user || user.emailVerifiedAt) return null

  function handleResend() {
    resendMutation.mutate(undefined, {
      onSuccess: () => {
        setSent(true)
        toast.success(t('common.verifyEmailBannerSent'))
      },
      onError: (err) => {
        toast.error(getErrorMessage(err))
      },
    })
  }

  return (
    <div className="flex items-center gap-3 bg-primary/10 border-b border-primary/20 px-4 py-3 text-sm">
      <MailIcon className="size-4 shrink-0 text-primary" />
      <p className="flex-1 text-foreground">{t('common.verifyEmailBannerText')}</p>
      {!sent && (
        <button
          onClick={handleResend}
          disabled={resendMutation.isPending}
          className="shrink-0 font-medium text-primary underline underline-offset-4 hover:no-underline disabled:opacity-50"
        >
          {resendMutation.isPending ? t('auth.verifyEmail.resending') : t('common.verifyEmailBannerAction')}
        </button>
      )}
    </div>
  )
}
