import { createFileRoute } from '@tanstack/react-router'
import { OnboardingFirstUploadPage } from '#/components/app/onboarding/OnboardingFirstUploadPage'

export const Route = createFileRoute('/onboarding/first-upload')({
  component: OnboardingFirstUploadPage,
})
