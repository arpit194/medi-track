import { createFileRoute } from '@tanstack/react-router'
import { OnboardingDonePage } from '#/components/app/onboarding/OnboardingDonePage'

export const Route = createFileRoute('/onboarding/done')({
  component: OnboardingDonePage,
})
