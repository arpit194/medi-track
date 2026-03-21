import { useNavigate } from '@tanstack/react-router'
import { SunIcon, MoonIcon, MonitorIcon, OctagonXIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import i18n from '#/i18n'
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

export function SettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const deleteAccount = useDeleteAccountMutation()

  const THEMES: { value: Theme; label: string; icon: typeof SunIcon }[] = [
    { value: 'light', label: t('settings.appearance.light'), icon: SunIcon },
    { value: 'dark', label: t('settings.appearance.dark'), icon: MoonIcon },
    { value: 'system', label: t('settings.appearance.system'), icon: MonitorIcon },
  ]

  async function handleDeleteAccount() {
    try {
      await deleteAccount.mutateAsync()
      toast.success(t('settings.dangerZone.deleteSuccess'))
      await navigate({ to: '/login' })
    } catch {
      // error shown via deleteAccount.isError
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-medium">{t('settings.heading')}</h1>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-medium">{t('settings.security.heading')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('settings.security.description')}
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
          <h2 className="text-base font-medium">{t('settings.appearance.heading')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('settings.appearance.description')}
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
          <h2 className="text-base font-medium">{t('settings.language.heading')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('settings.language.description')}
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              {(['en', 'hi'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => i18n.changeLanguage(lang)}
                  className={cn(
                    'flex min-h-11 flex-1 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors',
                    i18n.language === lang
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  {t(`settings.language.${lang}`)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-medium text-destructive">{t('settings.dangerZone.heading')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('settings.dangerZone.description')}
          </p>
        </div>
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col gap-4 pt-6">
            {deleteAccount.isError && (
              <Alert variant="destructive">
                <OctagonXIcon className="size-4" />
                <AlertTitle>{t('settings.dangerZone.deleteError')}</AlertTitle>
                <AlertDescription>{getErrorMessage(deleteAccount.error)}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-medium">{t('settings.dangerZone.deleteAccount')}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('settings.dangerZone.deleteDescription')}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger
                  render={<Button variant="destructive" className="shrink-0" />}
                >
                  {t('settings.dangerZone.deleteAccount')}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('settings.dangerZone.confirmHeading')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('settings.dangerZone.confirmDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('settings.dangerZone.keepAccount')}</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteAccount.isPending}
                    >
                      {deleteAccount.isPending ? t('settings.dangerZone.deleting') : t('settings.dangerZone.confirmDelete')}
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
