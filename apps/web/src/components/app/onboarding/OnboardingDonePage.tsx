import { CheckCircle2Icon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { OnboardingLayout } from './OnboardingLayout'

export function OnboardingDonePage() {
  return (
    <OnboardingLayout step={3}>
      <div className="flex flex-col items-center gap-6 text-center">
        <CheckCircle2Icon className="size-16 text-primary" strokeWidth={1.5} />

        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-medium">You're all set!</h1>
          <p className="text-muted-foreground leading-relaxed">
            Your MediTrack account is ready. Start adding your medical records whenever you're
            ready.
          </p>
        </div>

        <Link to="/dashboard" className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
          Go to my records
        </Link>
      </div>
    </OnboardingLayout>
  )
}
