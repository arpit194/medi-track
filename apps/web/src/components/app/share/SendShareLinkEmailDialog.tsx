import { useState } from 'react'
import { toast } from 'sonner'
import { MailIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '#/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useSendShareLinkEmailMutation } from '#/hooks/share'
import { getErrorMessage } from '#/api/client'

export function SendShareLinkEmailDialog({ shareLinkId }: { shareLinkId: string }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const { mutate, isPending, isError, error, reset } = useSendShareLinkEmailMutation()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setEmail('')
      reset()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    mutate(
      { id: shareLinkId, recipientEmail: email.trim() },
      {
        onSuccess: () => {
          toast.success(t('share.sendEmail.success'))
          handleOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <MailIcon className="size-4" />
        {t('share.sendByEmail')}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('share.sendEmail.heading')}</DialogTitle>
          <DialogDescription>{t('share.sendEmail.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="recipient-email">{t('share.sendEmail.emailField')}</Label>
            <Input
              id="recipient-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('share.sendEmail.emailPlaceholder')}
              autoComplete="email"
              autoFocus
            />
          </div>
          {isError && (
            <p className="text-sm text-destructive">{getErrorMessage(error)}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t('share.sendEmail.cancel')}
            </Button>
            <Button type="submit" disabled={!email.trim() || isPending}>
              {isPending ? t('share.sendEmail.sending') : t('share.sendEmail.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
