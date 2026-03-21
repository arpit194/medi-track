import { useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Route } from '#/routes/s/$token'
import { usePublicShareView } from '#/hooks/share'
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns'
import { FileIcon, ShieldIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import { NativeSelect, NativeSelectOption } from '#/components/ui/native-select'
import { DatePicker } from '#/components/shared/DatePicker'
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
    months: Array.from(yearMap.entries()).map(([month, reports]) => ({ month, reports })),
  }))
}

function ReportCard({ report }: { report: Report }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{report.title}</CardTitle>
        <CardDescription>{report.doctorName}</CardDescription>
        <CardAction>
          <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">{report.type}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{format(new Date(report.date), 'd MMMM yyyy')}</p>
        {report.notes && <p className="text-base leading-relaxed">{report.notes}</p>}
        {report.files.length > 0 && (
          <div className="flex flex-col gap-2">
            {report.files.map((file) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm hover:bg-accent transition-colors min-h-11"
              >
                <FileIcon className="size-4 text-muted-foreground shrink-0" />
                <span className="flex-1 truncate">{file.name}</span>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SharedReportPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-7 w-64" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent><Skeleton className="h-4 w-full" /></CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function SharedReportPage() {
  const { t } = useTranslation()
  const { token } = Route.useParams()
  const { type: typeFilter = '', dateFrom, dateTo, sortOrder } = useSearch({ from: '/s/$token' })
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = usePublicShareView(token)

  const types = useMemo(
    () => [...new Set((data?.reports ?? []).map((r) => r.type))].sort(),
    [data],
  )

  const dateRange = useMemo(() => {
    const dates = (data?.reports ?? []).map((r) => r.date).sort()
    return { min: dates[0], max: dates[dates.length - 1] }
  }, [data])

  const filtered = useMemo(() => {
    let reports = data?.reports ?? []
    if (typeFilter) reports = reports.filter((r) => r.type === typeFilter)
    if (dateFrom) reports = reports.filter((r) => {
      const d = parseISO(r.date)
      const from = parseISO(dateFrom)
      return isAfter(d, from) || isEqual(d, from)
    })
    if (dateTo) reports = reports.filter((r) => {
      const d = parseISO(r.date)
      const to = parseISO(dateTo)
      return isBefore(d, to) || isEqual(d, to)
    })
    const sorted = [...reports].sort((a, b) => a.date.localeCompare(b.date))
    return sortOrder === 'asc' ? sorted : sorted.reverse()
  }, [data, typeFilter, dateFrom, dateTo, sortOrder])

  const groups = useMemo(() => groupReports(filtered), [filtered])

  const hasFilters = !!typeFilter || !!dateFrom || !!dateTo

  function setSearch(updates: Record<string, string | undefined>) {
    void navigate({ to: '/s/$token', params: { token }, search: (prev) => ({ ...prev, ...updates }), replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <span className="font-serif text-xl font-medium">{t('common.appName')}</span>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ShieldIcon className="size-3.5" />
            {t('share.public.sharedSecurely')}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl flex flex-col gap-6 p-4 md:p-6">
        {isLoading && <SharedReportPageSkeleton />}

        {isError && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <FileIcon className="size-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">{t('share.public.unavailableHeading')}</p>
            <p className="text-muted-foreground leading-relaxed max-w-sm">{getErrorMessage(error)}</p>
          </div>
        )}

        {!isError && data && (
          <>
            <div className="flex flex-col gap-1">
              <h1 className="font-serif text-2xl font-medium">{data.label}</h1>
              <p className="text-sm text-muted-foreground">
                {t('share.public.expiresAt', { datetime: format(new Date(data.expiresAt), 'd MMM yyyy, HH:mm') })}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <NativeSelect
                value={typeFilter}
                onChange={(e) => setSearch({ type: e.target.value || undefined })}
                aria-label="Filter by report type"
                className="w-full [&_select]:h-11 [&_select]:w-full"
              >
                <NativeSelectOption value="">{t('common.allTypes')}</NativeSelectOption>
                {types.map((type) => (
                  <NativeSelectOption key={type} value={type}>{type}</NativeSelectOption>
                ))}
              </NativeSelect>

              <NativeSelect
                value={sortOrder}
                onChange={(e) => setSearch({ sortOrder: e.target.value as 'asc' | 'desc' })}
                aria-label="Sort order"
                className="w-full [&_select]:h-11 [&_select]:w-full"
              >
                <NativeSelectOption value="desc">{t('common.newestFirst')}</NativeSelectOption>
                <NativeSelectOption value="asc">{t('common.oldestFirst')}</NativeSelectOption>
              </NativeSelect>

              <DatePicker
                value={dateFrom ?? dateRange.min ?? ''}
                onChange={(v) => setSearch({ dateFrom: v || undefined })}
                placeholder={t('share.create.fromDate')}
                fromDate={dateRange.min}
                toDate={dateTo ?? dateRange.max}
              />
              <DatePicker
                value={dateTo ?? dateRange.max ?? ''}
                onChange={(v) => setSearch({ dateTo: v || undefined })}
                placeholder={t('share.create.toDate')}
                fromDate={dateFrom ?? dateRange.min}
                toDate={dateRange.max}
              />
            </div>

            {filtered.length === 0 && (
              <p className="text-muted-foreground py-8 text-center">
                {hasFilters ? t('share.public.noReportsFiltered') : t('share.public.noReports')}
              </p>
            )}

            <div className="flex flex-col gap-4">
              {groups.map(({ year, months }) => (
                <div key={year} className="flex flex-col">
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-sm font-semibold text-foreground">{year}</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="mt-3 flex flex-col">
                    {months.map(({ month, reports }) => (
                      <div key={month} className="relative flex gap-4">
                        <div className="relative flex flex-col items-center">
                          <div className="mt-1 size-2 shrink-0 rounded-full bg-primary/50 ring-2 ring-background ring-offset-1" />
                          <div className="mt-1 w-px flex-1 bg-border" />
                        </div>
                        <div className="flex flex-1 flex-col gap-3 pb-6">
                          <span className="text-sm font-medium text-muted-foreground leading-none">{month}</span>
                          {reports.map((report) => (
                            <ReportCard key={report.id} report={report} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
