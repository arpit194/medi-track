import type { LucideIcon } from 'lucide-react'
import type { TFunction } from 'i18next'
import {
  LayoutDashboardIcon,
  FolderOpenIcon,
  CalendarDaysIcon,
  Share2Icon,
} from 'lucide-react'

export type NavSubItem = {
  labelKey: string
  to: string
}

export type NavItem = {
  labelKey: string
  icon: LucideIcon
  to: string
  children?: NavSubItem[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    labelKey: 'nav.dashboard',
    icon: LayoutDashboardIcon,
    to: '/dashboard',
  },
  {
    labelKey: 'nav.reports',
    icon: FolderOpenIcon,
    to: '/reports',
    children: [
      { labelKey: 'nav.allReports', to: '/reports' },
      { labelKey: 'nav.uploadReport', to: '/reports/upload' },
    ],
  },
  {
    labelKey: 'nav.timeline',
    icon: CalendarDaysIcon,
    to: '/timeline',
  },
  {
    labelKey: 'nav.share',
    icon: Share2Icon,
    to: '/share',
    children: [
      { labelKey: 'nav.shareLinks', to: '/share' },
      { labelKey: 'nav.newLink', to: '/share/new' },
    ],
  },
]

export const PAGE_TITLE_KEYS: Record<string, string> = {
  '/dashboard': 'pageTitle.dashboard',
  '/reports': 'pageTitle.reports',
  '/reports/upload': 'pageTitle.uploadReport',
  '/timeline': 'pageTitle.timeline',
  '/profile': 'pageTitle.profile',
  '/settings': 'pageTitle.settings',
  '/share': 'pageTitle.shareLinks',
  '/share/new': 'pageTitle.newShareLink',
}

export function getPageTitleKey(pathname: string): string {
  if (PAGE_TITLE_KEYS[pathname]) return PAGE_TITLE_KEYS[pathname]
  if (pathname.startsWith('/reports/') && pathname.endsWith('/edit')) return 'pageTitle.editReport'
  if (pathname.startsWith('/reports/')) return 'pageTitle.report'
  return 'common.appName'
}

export function getPageTitle(pathname: string, t: TFunction): string {
  return t(getPageTitleKey(pathname))
}
