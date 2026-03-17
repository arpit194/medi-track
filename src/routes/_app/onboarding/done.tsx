import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/onboarding/done')({ component: OnboardingDonePage })

function OnboardingDonePage() {
  return <div>Onboarding — Done</div>
}
