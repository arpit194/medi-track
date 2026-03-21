import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '#/lib/utils'
import { NAV_ITEMS, type NavItem } from '#/lib/nav'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
} from '#/components/ui/sidebar'
import { DropdownMenu, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { UserMenuContent } from '#/components/shared/layout/UserMenuContent'
import { useUser } from '#/hooks/user'

function NavGroup({ item }: { item: NavItem }) {
  const { t } = useTranslation()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isGroupActive = item.children
    ? item.children.some((child) => pathname.startsWith(child.to))
    : pathname === item.to
  const [isOpen, setIsOpen] = useState(isGroupActive)
  const label = t(item.labelKey)

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<Link to={item.to} />}
          isActive={pathname === item.to}
          tooltip={label}
        >
          <item.icon />
          <span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setIsOpen((o) => !o)}
        isActive={isGroupActive && !isOpen}
        tooltip={label}
      >
        <item.icon />
        <span>{label}</span>
        <ChevronRightIcon
          className={cn('ml-auto size-4 transition-transform duration-200', isOpen && 'rotate-90')}
        />
      </SidebarMenuButton>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <SidebarMenuSub>
            {item.children.map((child) => (
              <SidebarMenuSubItem key={child.to}>
                <SidebarMenuSubButton
                  render={<Link to={child.to} />}
                  isActive={pathname === child.to}
                >
                  <span>{t(child.labelKey)}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </div>
      </div>
    </SidebarMenuItem>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function AppSidebar() {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const initials = user ? getInitials(user.name) : ''

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <Link to="/dashboard" className="font-serif text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            {t('common.appName')}
          </Link>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {NAV_ITEMS.map((item) => (
                <NavGroup key={item.to} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
                <div className="flex items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent">
                  <Avatar className="size-7 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col items-end group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-medium">{user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <UserMenuContent align="start" />
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
