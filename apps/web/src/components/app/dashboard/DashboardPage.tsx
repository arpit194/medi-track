import { useMemo, useRef, useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { format, startOfMonth } from 'date-fns'
import { gsap } from 'gsap'
import { ArrowRightIcon, ClockIcon, FileTextIcon, TagsIcon, UploadIcon } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { buttonVariants } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
import { cn } from '#/lib/utils'
import { useReports, useReportFilters } from '#/hooks/reports'
import { useUser } from '#/hooks/user'
import type { Report } from '@medi-track/types'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const obj = useRef({ val: 0 })
  const prev = useRef<number | null>(null)

  useEffect(() => {
    if (prev.current === value) return
    prev.current = value
    gsap.to(obj.current, {
      val: value,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => setDisplay(Math.round(obj.current.val)),
    })
  }, [value])

  return <span className="text-3xl font-semibold">{display}</span>
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <CardAction>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-4 text-primary" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <AnimatedNumber value={value} />
        )}
      </CardContent>
    </Card>
  )
}

function RecentReportRow({ report }: { report: Report }) {
  return (
    <Link
      to="/reports/$id"
      params={{ id: report.id }}
      className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium group-hover:text-primary transition-colors">
          {report.title}
        </span>
        <span className="text-xs text-muted-foreground">
          {report.doctorName ? `${report.doctorName} · ` : ''}
          {format(new Date(report.date), 'd MMM yyyy')}
        </span>
      </div>
      <Badge className="shrink-0 text-xs">{report.type}</Badge>
      <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}

function RecentReportRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-2 py-2.5">
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  )
}

export function DashboardPage() {
  const today = new Date()
  const monthStart = format(startOfMonth(today), 'yyyy-MM-dd')
  const todayStr = format(today, 'yyyy-MM-dd')

  const { data: user } = useUser()
  const { data: recentData, isLoading: recentLoading } = useReports({ limit: 5, sortOrder: 'desc' })
  const { data: monthData, isLoading: monthLoading } = useReports({ limit: 1, dateFrom: monthStart, dateTo: todayStr })
  const { data: filters, isLoading: filtersLoading } = useReportFilters()

  const firstName = useMemo(() => user?.name?.split(' ')[0] ?? '', [user?.name])
  const recentReports = recentData?.data ?? []

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        {user ? (
          <h1 className="text-2xl font-medium">{greeting()}, {firstName}</h1>
        ) : (
          <Skeleton className="h-8 w-56" />
        )}
        <p className="text-sm text-muted-foreground">Here's a summary of your medical records.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <StatCard
          icon={FileTextIcon}
          label="Total reports"
          value={recentData?.total ?? 0}
          loading={recentLoading}
        />
        <StatCard
          icon={ClockIcon}
          label="This month"
          value={monthData?.total ?? 0}
          loading={monthLoading}
        />
        <StatCard
          icon={TagsIcon}
          label="Report types"
          value={filters?.types.length ?? 0}
          loading={filtersLoading}
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link to="/reports/upload" className={cn(buttonVariants(), 'gap-2')}>
          <UploadIcon className="size-4" />
          Upload a report
        </Link>
        <Link to="/timeline" className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}>
          <ClockIcon className="size-4" />
          View timeline
        </Link>
      </div>

      {/* Recent reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent reports</CardTitle>
          {!recentLoading && recentReports.length > 0 && (
            <CardAction>
              <Link
                to="/reports"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="flex flex-col pb-2">
          {recentLoading && (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <RecentReportRowSkeleton key={i} />
              ))}
            </>
          )}

          {!recentLoading && recentReports.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">No reports yet. Upload your first one to get started.</p>
              <Link to="/reports/upload" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Upload a report
              </Link>
            </div>
          )}

          {!recentLoading && recentReports.map((report) => (
            <RecentReportRow key={report.id} report={report} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
