import { Link } from '@tanstack/react-router'
import { Route } from '#/routes/_auth/reset-password'
import { ResetPasswordForm } from './ResetPasswordForm'

export function ResetPasswordPage() {
  const { token } = Route.useSearch()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-serif text-3xl font-medium">Set a new password</h1>
        <p className="text-muted-foreground leading-relaxed">
          Choose a strong password you haven't used before.
        </p>
      </div>

      <ResetPasswordForm token={token} />

      <p className="text-center text-muted-foreground">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
