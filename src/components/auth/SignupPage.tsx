import { Link } from '@tanstack/react-router'
import { SignupForm } from './SignupForm'

export function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-serif text-3xl font-medium">Create your account</h1>
        <p className="text-muted-foreground leading-relaxed">
          Your medical records, organised and always with you.
        </p>
      </div>

      <SignupForm />

      <p className="text-center text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
