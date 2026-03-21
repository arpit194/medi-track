import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '#/lib/utils'

const STEPS = ['Your profile', 'First record', 'All done']

type OnboardingLayoutProps = {
  children: ReactNode
  step: 1 | 2 | 3
}

export function OnboardingLayout({ children, step }: OnboardingLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-svh bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <span className="font-serif text-2xl font-semibold text-primary">{t('common.appName')}</span>
        </div>

        <div className="flex gap-3">
          {STEPS.map((label, i) => {
            const stepNum = (i + 1) as 1 | 2 | 3
            const isActive = stepNum === step
            const isDone = stepNum < step
            return (
              <div key={label} className="flex flex-1 flex-col gap-1.5">
                <div
                  className={cn(
                    'h-1.5 rounded-full transition-colors',
                    isDone || isActive ? 'bg-primary' : 'bg-muted',
                  )}
                />
                <span
                  className={cn(
                    'text-xs text-center',
                    isActive ? 'text-foreground font-medium' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        {children}
      </div>
    </div>
  )
}
