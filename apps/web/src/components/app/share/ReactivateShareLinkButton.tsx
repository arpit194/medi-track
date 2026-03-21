import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '#/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '#/components/ui/dialog'
import { Field, FieldLabel } from '#/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'

type Props = {
  onConfirm: (expiresIn: string) => void
  isLoading: boolean
}

export function ReactivateShareLinkButton({ onConfirm, isLoading }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [expiresIn, setExpiresIn] = useState('7d')

  const EXPIRY_OPTIONS = [
    { value: '24h', label: t('expiry.24h') },
    { value: '7d', label: t('expiry.7d') },
    { value: '30d', label: t('expiry.30d') },
    { value: 'one_time', label: t('expiry.one_time') },
  ] as const

  function handleConfirm() {
    onConfirm(expiresIn)
    setOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" disabled={isLoading} onClick={() => setOpen(true)}>
        {t('share.reactivate')}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('share.reactivateDialog.heading')}</DialogTitle>
            <DialogDescription>
              {t('share.reactivateDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="reactivate-expiry">{t('share.reactivateDialog.expiryField')}</FieldLabel>
            <Select value={expiresIn} onValueChange={(v) => { if (v) setExpiresIn(v) }}>
              <SelectTrigger id="reactivate-expiry" className="data-[size=default]:h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPIRY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>{t('share.reactivateDialog.cancel')}</DialogClose>
            <Button onClick={handleConfirm}>{t('share.reactivateDialog.confirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
