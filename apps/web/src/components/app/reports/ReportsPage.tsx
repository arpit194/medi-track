import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { PlusIcon, FolderOpenIcon, OctagonXIcon, SearchIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { cn } from '#/lib/utils'
import { buttonVariants } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '#/components/ui/alert'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '#/components/ui/empty'
import { NativeSelect, NativeSelectOption } from '#/components/ui/native-select'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from '#/components/ui/pagination'
import { DatePicker } from '#/components/shared/DatePicker'
import { useReports, useReportFilters } from '#/hooks/reports'
import { getErrorMessage } from '#/api/client'
import type { Report } from '@medi-track/types'

function ReportCard({ report }: { report: Report }) {
  return (
    <Link
      to="/reports/$id"
      params={{ id: report.id }}
      className="block min-w-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>{report.title}</CardTitle>
          <CardDescription>{report.doctorName}</CardDescription>
          <CardAction>
            <Badge>{report.type}</Badge>
          </CardAction>
        </CardHeader>
        {report.notes && (
          <CardContent>
            <p className="wrap-break-word text-base text-muted-foreground leading-relaxed line-clamp-2">
              {report.notes}
            </p>
          </CardContent>
        )}
        <CardFooter>
          <span className="text-sm text-muted-foreground">
            {format(new Date(report.date), 'dd MMM yyyy')}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}

function ReportCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-28" />
        <CardAction>
          <Skeleton className="h-5 w-20 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  )
}

function ReportsPagination({ page, totalPages }: { page: number; totalPages: number }) {
  const navigate = useNavigate()

  function goTo(p: number) {
    navigate({ to: '/reports', search: (prev) => ({ ...prev, page: p }) })
  }

  if (totalPages <= 1) return null

  const pages = buildPageNumbers(page, totalPages)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={page > 1 ? () => goTo(page - 1) : undefined}
            aria-disabled={page <= 1}
            className={cn(page <= 1 && 'pointer-events-none opacity-50')}
          />
        </PaginationItem>

        {pages.map((p, i) =>
          p === '...' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={() => goTo(p as number)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={page < totalPages ? () => goTo(page + 1) : undefined}
            aria-disabled={page >= totalPages}
            className={cn(page >= totalPages && 'pointer-events-none opacity-50')}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

export function ReportsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = useSearch({ from: '/_app/reports/' })
  const { page, limit, type, search: searchQuery, dateFrom, dateTo, sortOrder } = search

  const { data: filters } = useReportFilters()
  const { data, isLoading, isError, error } = useReports({ page, limit, type, search: searchQuery, dateFrom, dateTo, sortOrder })

  const reports = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  function setSearch(updates: Record<string, string | number | undefined>) {
    navigate({ to: '/reports', search: (prev) => ({ ...prev, ...updates, page: 1 }) })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">{t('reports.heading')}</h1>
        <Link to="/reports/upload" className={cn(buttonVariants(), 'shrink-0')}>
          <PlusIcon className="size-4" />
          {t('reports.uploadButton')}
        </Link>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder={t('reports.searchPlaceholder')}
          value={searchQuery ?? ''}
          onChange={(e) => setSearch({ search: e.target.value || undefined })}
          className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-4 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NativeSelect
          value={type ?? ''}
          onChange={(e) => setSearch({ type: e.target.value || undefined })}
          className="w-full [&_select]:h-11 [&_select]:w-full"
          aria-label={t('reports.filterByType')}
        >
          <NativeSelectOption value="">{t('common.allTypes')}</NativeSelectOption>
          {filters?.types.map((type) => (
            <NativeSelectOption key={type} value={type}>{type}</NativeSelectOption>
          ))}
        </NativeSelect>

        <NativeSelect
          value={sortOrder}
          onChange={(e) => setSearch({ sortOrder: e.target.value as 'asc' | 'desc' })}
          className="w-full [&_select]:h-11 [&_select]:w-full"
          aria-label={t('reports.sortOrder')}
        >
          <NativeSelectOption value="desc">{t('common.newestFirst')}</NativeSelectOption>
          <NativeSelectOption value="asc">{t('common.oldestFirst')}</NativeSelectOption>
        </NativeSelect>

        <DatePicker
          value={dateFrom ?? filters?.dateRange.min ?? ''}
          onChange={(v) => setSearch({ dateFrom: v || undefined })}
          fromDate={filters?.dateRange.min ?? undefined}
          toDate={dateTo ?? filters?.dateRange.max ?? undefined}
        />
        <DatePicker
          value={dateTo ?? filters?.dateRange.max ?? ''}
          onChange={(v) => setSearch({ dateTo: v || undefined })}
          fromDate={dateFrom ?? filters?.dateRange.min ?? undefined}
          toDate={filters?.dateRange.max ?? undefined}
        />
      </div>

      {isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>{t('reports.loadError')}</AlertTitle>
          <AlertDescription>{getErrorMessage(error)} {t('common.tryAgain')}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReportCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !isError && reports.length === 0 && !type && !searchQuery && !dateFrom && !dateTo && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><FolderOpenIcon /></EmptyMedia>
            <EmptyTitle>{t('reports.noReportsHeading')}</EmptyTitle>
            <EmptyDescription>{t('reports.noReportsDescription')}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to="/reports/upload" className={buttonVariants()}>{t('reports.uploadFirst')}</Link>
          </EmptyContent>
        </Empty>
      )}

      {!isLoading && !isError && reports.length === 0 && (type || searchQuery || dateFrom || dateTo) && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><FolderOpenIcon /></EmptyMedia>
            <EmptyTitle>{t('reports.noResultsHeading')}</EmptyTitle>
            <EmptyDescription>{t('reports.noResultsDescription')}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!isLoading && !isError && reports.length > 0 && (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}

      {(data?.total ?? 0) > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <NativeSelect
            value={limit}
            onChange={(e) => navigate({ to: '/reports', search: (prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }) })}
            className="w-36 [&_select]:h-11"
            aria-label={t('reports.reportsPerPage')}
          >
            <NativeSelectOption value={5}>{t('common.perPage', { count: 5 })}</NativeSelectOption>
            <NativeSelectOption value={10}>{t('common.perPage', { count: 10 })}</NativeSelectOption>
            <NativeSelectOption value={20}>{t('common.perPage', { count: 20 })}</NativeSelectOption>
            <NativeSelectOption value={50}>{t('common.perPage', { count: 50 })}</NativeSelectOption>
          </NativeSelect>
          <ReportsPagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
