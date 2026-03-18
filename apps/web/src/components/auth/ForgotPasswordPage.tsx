import { Link } from '@tanstack/react-router'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-serif text-3xl font-medium">Forgot your password?</h1>
        <p className="text-muted-foreground leading-relaxed">
          Enter your email and we'll send you a link to reset it.
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-muted-foreground">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
