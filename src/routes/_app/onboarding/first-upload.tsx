import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/onboarding/first-upload')({ component: OnboardingFirstUploadPage })

function OnboardingFirstUploadPage() {
  return <div>Onboarding — Upload First Report</div>
}
