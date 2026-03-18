import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboardIcon,
  FolderOpenIcon,
  CalendarDaysIcon,
  Share2Icon,
} from 'lucide-react'

export type NavSubItem = {
  label: string
  to: string
}

export type NavItem = {
  label: string
  icon: LucideIcon
  to: string
  children?: NavSubItem[]
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboardIcon,
    to: '/dashboard',
  },
  {
    label: 'Reports',
    icon: FolderOpenIcon,
    to: '/reports',
    children: [
      { label: 'All reports', to: '/reports' },
      { label: 'Upload', to: '/reports/upload' },
    ],
  },
  {
    label: 'Timeline',
    icon: CalendarDaysIcon,
    to: '/timeline',
  },
  {
    label: 'Share',
    icon: Share2Icon,
    to: '/share',
    children: [
      { label: 'Share links', to: '/share' },
      { label: 'New link', to: '/share/new' },
    ],
  },
]

export const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/reports': 'Reports',
  '/reports/upload': 'Upload Report',
  '/timeline': 'Timeline',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/share': 'Share Links',
  '/share/new': 'New Share Link',
}

export function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/reports/') && pathname.endsWith('/edit')) return 'Edit Report'
  if (pathname.startsWith('/reports/')) return 'Report'
  return 'MediTrack'
}
