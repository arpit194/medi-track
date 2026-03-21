import type { ReactNode } from 'react'
import { SidebarProvider, SidebarInset } from '#/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { BottomTabBar } from './BottomTabBar'
import { EmailVerificationBanner } from './EmailVerificationBanner'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <EmailVerificationBanner />
        <div className="flex flex-1 flex-col pb-16 md:pb-0">
          {children}
        </div>
      </SidebarInset>
      <BottomTabBar />
    </SidebarProvider>
  )
}
