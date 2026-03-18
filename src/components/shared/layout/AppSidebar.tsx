import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRightIcon, SettingsIcon, UserIcon, LogOutIcon } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'

function NavGroup({ item }: { item: NavItem }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isGroupActive = item.children
    ? item.children.some((child) => pathname.startsWith(child.to))
    : pathname === item.to
  const [isOpen, setIsOpen] = useState(isGroupActive)

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<Link to={item.to} />}
          isActive={pathname === item.to}
          tooltip={item.label}
        >
          <item.icon />
          <span>{item.label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setIsOpen((o) => !o)}
        isActive={isGroupActive && !isOpen}
        tooltip={item.label}
      >
        <item.icon />
        <span>{item.label}</span>
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
                  <span>{child.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </div>
      </div>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <Link to="/dashboard" className="font-serif text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            MediTrack
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
                      AU
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col items-end group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-medium">Test User</span>
                    <span className="truncate text-xs text-muted-foreground">test@example.com</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-52">
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
