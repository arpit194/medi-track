import { Link, useRouter, useRouterState } from '@tanstack/react-router'
import { ChevronLeftIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getPageTitle } from '#/lib/nav'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { UserMenuContent } from '#/components/shared/layout/UserMenuContent'
import { useUser } from '#/hooks/user'

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export function AppHeader() {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const historyIdx = useRouterState({ select: (s) => s.location.state.__TSR_index })
  const title = getPageTitle(pathname, t)
  const { data: user } = useUser()
  const initials = user ? getInitials(user.name) : ''
  const canGoBack = historyIdx > 0

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <Link
        to="/dashboard"
        className="font-serif text-lg font-semibold text-primary md:hidden"
      >
        {t('common.appName')}
      </Link>

      <div className="hidden items-center gap-1 md:flex">
        {canGoBack && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            className="size-8 text-muted-foreground"
            onClick={() => router.history.back()}
          >
            <ChevronLeftIcon className="size-5" />
          </Button>
        )}
        <h1 className="text-base font-medium">{title}</h1>
      </div>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <UserMenuContent align="end" />
        </DropdownMenu>
      </div>
    </header>
  )
}
