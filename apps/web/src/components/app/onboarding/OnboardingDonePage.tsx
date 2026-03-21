import { CheckCircle2Icon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { OnboardingLayout } from './OnboardingLayout'

export function OnboardingDonePage() {
  const { t } = useTranslation()

  return (
    <OnboardingLayout step={3}>
      <div className="flex flex-col items-center gap-6 text-center">
        <CheckCircle2Icon className="size-16 text-primary" strokeWidth={1.5} />

        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-medium">{t('onboarding.done.heading')}</h1>
          <p className="text-muted-foreground leading-relaxed">
            {t('onboarding.done.description')}
          </p>
        </div>

        <Link to="/dashboard" className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
          {t('onboarding.done.goToRecords')}
        </Link>
      </div>
    </OnboardingLayout>
  )
}
