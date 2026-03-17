import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/onboarding/profile')({ component: OnboardingProfilePage })

function OnboardingProfilePage() {
  return <div>Onboarding — Basic Profile</div>
}
