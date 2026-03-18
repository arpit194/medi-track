import { useNavigate } from '@tanstack/react-router'
import { SunIcon, MoonIcon, MonitorIcon, OctagonXIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '#/lib/utils'
import { Card, CardContent } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/components/ui/alert-dialog'
import { ChangePasswordForm } from './ChangePasswordForm'
import { useTheme, type Theme } from '#/hooks/theme'
import { useDeleteAccountMutation } from '#/hooks/user'
import { getErrorMessage } from '#/api/client'

const THEMES: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: MonitorIcon },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const deleteAccount = useDeleteAccountMutation()

  async function handleDeleteAccount() {
    try {
      await deleteAccount.mutateAsync()
      toast.success('Your account has been deleted.')
      await navigate({ to: '/login' })
    } catch {
      // error shown via deleteAccount.isError
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-medium">Settings</h1>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-medium">Security</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Update your password to keep your account secure.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-medium">Appearance</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Choose how MediTrack looks on your device.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              {THEMES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex min-h-11 flex-1 flex-col items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors',
                    theme === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <Icon className="size-5" />
                  {label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-medium text-destructive">Danger zone</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Actions here are permanent and cannot be undone.
          </p>
        </div>
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col gap-4 pt-6">
            {deleteAccount.isError && (
              <Alert variant="destructive">
                <OctagonXIcon className="size-4" />
                <AlertTitle>Couldn't delete account</AlertTitle>
                <AlertDescription>{getErrorMessage(deleteAccount.error)}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-medium">Delete account</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Permanently remove your account and all your medical records.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger
                  render={<Button variant="destructive" className="shrink-0" />}
                >
                  Delete account
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all your medical records. This
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep my account</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteAccount.isPending}
                    >
                      {deleteAccount.isPending ? 'Deleting…' : 'Yes, delete everything'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
