import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '#/lib/utils'
import type { NavItem } from '#/lib/nav'
import { NAV_ITEMS } from '#/lib/nav'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'

function TabItem({
  item,
  isActive,
  onOpenSheet,
}: {
  item: NavItem
  isActive: boolean
  onOpenSheet: () => void
}) {
  const { t } = useTranslation()
  const label = t(item.labelKey)
  const baseClass = cn(
    'flex flex-1 flex-col items-center gap-1 py-2 min-h-14 justify-center transition-colors',
    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
  )

  if (item.children) {
    return (
      <button type="button" className={baseClass} onClick={onOpenSheet}>
        <item.icon className="size-5" />
        <span className={cn('text-xs', isActive && 'font-medium')}>{label}</span>
      </button>
    )
  }

  return (
    <Link to={item.to} className={baseClass}>
      <item.icon className="size-5" />
      <span className={cn('text-xs', isActive && 'font-medium')}>{label}</span>
    </Link>
  )
}

export function BottomTabBar() {
  const { t } = useTranslation()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [openSheet, setOpenSheet] = useState<string | null>(null)

  const activeSheetItem = NAV_ITEMS.find((item) => item.to === openSheet)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-background md:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = item.children
            ? item.children.some((child) => pathname.startsWith(child.to))
            : pathname === item.to

          return (
            <TabItem
              key={item.to}
              item={item}
              isActive={isActive}
              onOpenSheet={() => setOpenSheet(item.to)}
            />
          )
        })}
      </nav>

      <Sheet open={openSheet !== null} onOpenChange={(open) => !open && setOpenSheet(null)}>
        <SheetContent side="bottom" showCloseButton={false} className="pb-safe rounded-t-xl">
          <SheetHeader>
            <SheetTitle>{activeSheetItem ? t(activeSheetItem.labelKey) : ''}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col pb-4">
            {activeSheetItem?.children?.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                onClick={() => setOpenSheet(null)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-base transition-colors',
                  pathname === child.to
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted',
                )}
              >
                {t(child.labelKey)}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
