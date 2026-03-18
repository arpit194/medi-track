import { createFileRoute } from '@tanstack/react-router'
import { OnboardingProfilePage } from '#/components/app/onboarding/OnboardingProfilePage'

export const Route = createFileRoute('/onboarding/profile')({
  component: OnboardingProfilePage,
})
