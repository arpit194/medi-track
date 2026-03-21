import {
  createFileRoute,
  Outlet,
  redirect,
  isRedirect,
} from '@tanstack/react-router'
import { AppShell } from '#/components/shared/layout/AppShell'
import { Skeleton } from '#/components/ui/skeleton'
import { api } from '#/api'
import { TOKEN_KEY } from '#/api/client'
import { userKeys } from '#/hooks/user'

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context }) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) throw redirect({ to: '/login' })

    try {
      const user = await context.queryClient.ensureQueryData({
        queryKey: userKeys.current(),
        queryFn: api.user.getUser,
      })
      if (!user.isOnboarded) throw redirect({ to: '/onboarding/profile' })
    } catch (error) {
      if (isRedirect(error)) throw error
      localStorage.removeItem(TOKEN_KEY)
      throw redirect({ to: '/login' })
    }
  },
  pendingComponent: AppLayoutPending,
  component: AppLayout,
})

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

function AppLayoutPending() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 w-full max-w-4xl mx-auto">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
