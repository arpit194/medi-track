import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { PlusIcon, FolderOpenIcon, OctagonXIcon } from 'lucide-react'
import { format } from 'date-fns'
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
  const navigate = useNavigate()
  const search = useSearch({ from: '/_app/reports/' })
  const { page, limit, type, dateFrom, dateTo, sortOrder } = search

  const { data: filters } = useReportFilters()
  const { data, isLoading, isError, error } = useReports({ page, limit, type, dateFrom, dateTo, sortOrder })

  const reports = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  function setSearch(updates: Record<string, string | number | undefined>) {
    navigate({ to: '/reports', search: (prev) => ({ ...prev, ...updates, page: 1 }) })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">My Reports</h1>
        <Link to="/reports/upload" className={cn(buttonVariants(), 'shrink-0')}>
          <PlusIcon className="size-4" />
          Upload
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NativeSelect
          value={type ?? ''}
          onChange={(e) => setSearch({ type: e.target.value || undefined })}
          className="w-full [&_select]:h-11 [&_select]:w-full"
          aria-label="Filter by report type"
        >
          <NativeSelectOption value="">All types</NativeSelectOption>
          {filters?.types.map((t) => (
            <NativeSelectOption key={t} value={t}>{t}</NativeSelectOption>
          ))}
        </NativeSelect>

        <NativeSelect
          value={sortOrder}
          onChange={(e) => setSearch({ sortOrder: e.target.value as 'asc' | 'desc' })}
          className="w-full [&_select]:h-11 [&_select]:w-full"
          aria-label="Sort order"
        >
          <NativeSelectOption value="desc">Newest first</NativeSelectOption>
          <NativeSelectOption value="asc">Oldest first</NativeSelectOption>
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
          <AlertTitle>Couldn't load your reports</AlertTitle>
          <AlertDescription>{getErrorMessage(error)} Please try again.</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReportCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !isError && reports.length === 0 && !type && !dateFrom && !dateTo && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><FolderOpenIcon /></EmptyMedia>
            <EmptyTitle>No reports yet</EmptyTitle>
            <EmptyDescription>Your medical reports will appear here once you upload them.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to="/reports/upload" className={buttonVariants()}>Upload your first report</Link>
          </EmptyContent>
        </Empty>
      )}

      {!isLoading && !isError && reports.length === 0 && (type || dateFrom || dateTo) && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><FolderOpenIcon /></EmptyMedia>
            <EmptyTitle>No reports found</EmptyTitle>
            <EmptyDescription>Try adjusting your filters.</EmptyDescription>
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
            aria-label="Reports per page"
          >
            <NativeSelectOption value={5}>5 per page</NativeSelectOption>
            <NativeSelectOption value={10}>10 per page</NativeSelectOption>
            <NativeSelectOption value={20}>20 per page</NativeSelectOption>
            <NativeSelectOption value={50}>50 per page</NativeSelectOption>
          </NativeSelect>
          <ReportsPagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
