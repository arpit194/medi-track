import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AuthLayout } from '#/components/shared/layout/AuthLayout'
import { TOKEN_KEY } from '#/api/client'

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) throw redirect({ to: '/dashboard' })
  },
  component: AuthRoot,
})

function AuthRoot() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}
