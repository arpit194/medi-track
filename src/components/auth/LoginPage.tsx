import { Link } from '@tanstack/react-router'
import { LoginForm } from './LoginForm'

export function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-serif text-3xl font-medium">Welcome back</h1>
        <p className="text-muted-foreground leading-relaxed">
          Sign in to access your medical records.
        </p>
      </div>

      <LoginForm />

      <div className="flex flex-col gap-2 text-center text-muted-foreground">
        <p>
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Create one
          </Link>
        </p>
        <p>
          <Link
            to="/forgot-password"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  )
}
