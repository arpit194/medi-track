import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthLayout } from '#/components/shared/layout/AuthLayout'

export const Route = createFileRoute('/_auth')({ component: AuthRoot })

function AuthRoot() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  )
}
