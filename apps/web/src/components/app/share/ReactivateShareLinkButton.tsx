import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '#/components/ui/dialog'
import { Field, FieldLabel } from '#/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'

const EXPIRY_OPTIONS = [
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'one_time', label: 'One-time view' },
] as const

type Props = {
  onConfirm: (expiresIn: string) => void
  isLoading: boolean
}

export function ReactivateShareLinkButton({ onConfirm, isLoading }: Props) {
  const [open, setOpen] = useState(false)
  const [expiresIn, setExpiresIn] = useState('7d')

  function handleConfirm() {
    onConfirm(expiresIn)
    setOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" disabled={isLoading} onClick={() => setOpen(true)}>
        Reactivate
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reactivate this link?</DialogTitle>
            <DialogDescription>
              Choose how long the link should be valid from now.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="reactivate-expiry">Link expires after</FieldLabel>
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
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={handleConfirm}>Reactivate link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
