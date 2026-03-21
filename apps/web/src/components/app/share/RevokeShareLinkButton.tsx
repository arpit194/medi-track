import { useTranslation } from 'react-i18next'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '#/components/ui/alert-dialog'
import { Button } from '#/components/ui/button'

type Props = {
  onConfirm: () => void
  isLoading: boolean
}

export function RevokeShareLinkButton({ onConfirm, isLoading }: Props) {
  const { t } = useTranslation()

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" disabled={isLoading} />}>
        {t('share.revokeButton')}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('share.revoke.heading')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('share.revoke.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('share.revoke.keepIt')}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {t('share.revoke.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
