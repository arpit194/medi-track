import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()

  return (
    <div className="min-h-svh bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <span className="font-serif text-2xl font-semibold text-primary">{t('common.appName')}</span>
        </div>
        {children}
      </div>
    </div>
  )
}
