import { OnboardingLayout } from './OnboardingLayout'
import { OnboardingProfileForm } from './OnboardingProfileForm'

export function OnboardingProfilePage() {
  return (
    <OnboardingLayout step={1}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="font-serif text-3xl font-medium">Tell us about yourself</h1>
          <p className="text-muted-foreground leading-relaxed">
            This helps us organise your records better.
          </p>
        </div>
        <OnboardingProfileForm />
      </div>
    </OnboardingLayout>
  )
}
