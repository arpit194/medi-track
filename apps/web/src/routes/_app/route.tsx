import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '#/components/shared/layout/AppShell'

export const Route = createFileRoute('/_app')({ component: AppLayout })

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
