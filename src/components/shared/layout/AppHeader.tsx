import { Link, useRouterState } from '@tanstack/react-router'
import { SettingsIcon, UserIcon, LogOutIcon } from 'lucide-react'
import { getPageTitle } from '#/lib/nav'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'

export function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const title = getPageTitle(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      {/* Brand — mobile only (no sidebar visible) */}
      <Link
        to="/dashboard"
        className="font-serif text-lg font-semibold text-primary md:hidden"
      >
        MediTrack
      </Link>

      <h1 className="hidden text-base font-medium md:block">{title}</h1>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                AU
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuItem render={<Link to="/profile" />}>
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link to="/settings" />}>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" render={<Link to="/login" />}>
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
