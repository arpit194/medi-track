import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { FolderOpenIcon, OctagonXIcon } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '#/components/ui/alert'
import { NativeSelect, NativeSelectOption } from '#/components/ui/native-select'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '#/components/ui/empty'
import { buttonVariants } from '#/components/ui/button'
import { useReports, useReportFilters } from '#/hooks/reports'
import { getErrorMessage } from '#/api/client'
import type { Report } from '@medi-track/types'

type MonthGroup = { month: string; reports: Report[] }
type YearGroup = { year: string; months: MonthGroup[] }

function groupReports(reports: Report[]): YearGroup[] {
  const map = new Map<string, Map<string, Report[]>>()

  for (const report of reports) {
    const year = report.date.slice(0, 4)
    const month = format(new Date(report.date), 'MMMM')
    if (!map.has(year)) map.set(year, new Map())
    const yearMap = map.get(year)!
    if (!yearMap.has(month)) yearMap.set(month, [])
    yearMap.get(month)!.push(report)
  }

  return Array.from(map.entries()).map(([year, yearMap]) => ({
    year,
    months: Array.from(yearMap.entries()).map(([month, reports]) => ({
      month,
      reports,
    })),
  }))
}

function TimelineCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-56" />
        </CardDescription>
        <CardAction>
          <Skeleton className="h-5 w-20 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-28" />
      </CardContent>
    </Card>
  )
}

function TimelineCard({ report }: { report: Report }) {
  return (
    <Link
      to="/reports/$id"
      params={{ id: report.id }}
      className="group block focus-visible:outline-none"
    >
      <Card className="w-full transition-shadow duration-200 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardHeader>
          <CardTitle className="truncate group-hover:text-primary transition-colors">
            {report.title}
          </CardTitle>
          {report.notes && (
            <CardDescription className="truncate" title={report.notes}>
              {report.notes}
            </CardDescription>
          )}
          <CardAction>
            <Badge className="text-xs">{report.type}</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 pb-1 text-sm text-muted-foreground">
          {report.doctorName && <span>{report.doctorName}</span>}
          <span>{format(new Date(report.date), 'd MMMM yyyy')}</span>
        </CardContent>
      </Card>
    </Link>
  )
}

function MonthSection({ month, reports }: MonthGroup) {
  return (
    <div className="relative flex gap-5">
      {/* Timeline rail */}
      <div className="relative flex flex-col items-center">
        <div className="mt-1 size-2.5 shrink-0 rounded-full bg-primary/60 ring-2 ring-background ring-offset-1" />
        <div className="mt-1 w-px flex-1 bg-border" />
      </div>

      <div className="flex flex-1 flex-col gap-3 pb-6">
        <span className="leading-none text-base font-medium text-muted-foreground">
          {month}
        </span>
        {reports.map((report) => (
          <TimelineCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  )
}

function YearDivider({ year }: { year: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-base font-semibold text-foreground">{year}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

export function TimelinePage() {
  const [typeFilter, setTypeFilter] = useState('')
  const { data: filters } = useReportFilters()
  const { data, isLoading, isError, error } = useReports({
    limit: 500,
    sortOrder: 'desc',
  })

  const reports = data?.data ?? []

  const filtered = useMemo(
    () => (typeFilter ? reports.filter((r) => r.type === typeFilter) : reports),
    [reports, typeFilter],
  )

  const groups = useMemo(() => groupReports(filtered), [filtered])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Timeline</h1>
        <NativeSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filter by report type"
          className="w-40 [&_select]:h-9"
        >
          <NativeSelectOption value="">All types</NativeSelectOption>
          {filters?.types.map((t) => (
            <NativeSelectOption key={t} value={t}>
              {t}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      {isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>Couldn't load your timeline</AlertTitle>
          <AlertDescription>
            {getErrorMessage(error)} Please try again.
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <TimelineCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpenIcon />
            </EmptyMedia>
            <EmptyTitle>
              {typeFilter ? 'No reports for this type' : 'No reports yet'}
            </EmptyTitle>
            <EmptyDescription>
              {typeFilter
                ? 'Try a different type filter.'
                : 'Your medical history will appear here once you upload reports.'}
            </EmptyDescription>
          </EmptyHeader>
          {!typeFilter && (
            <EmptyContent>
              <Link to="/reports/upload" className={buttonVariants()}>
                Upload your first report
              </Link>
            </EmptyContent>
          )}
        </Empty>
      )}

      {!isLoading && !isError && groups.length > 0 && (
        <div className="flex flex-col gap-4">
          {groups.map(({ year, months }) => (
            <div key={year} className="flex flex-col">
              <YearDivider year={year} />
              <div className="mt-4 flex flex-col">
                {months.map((group) => (
                  <MonthSection key={group.month} {...group} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
