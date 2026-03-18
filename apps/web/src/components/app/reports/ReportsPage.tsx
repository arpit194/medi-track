import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { PlusIcon, FolderOpenIcon, OctagonXIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '#/lib/utils'
import { buttonVariants } from '#/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '#/components/ui/alert'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '#/components/ui/empty'
import { NativeSelect, NativeSelectOption } from '#/components/ui/native-select'
import { ReportTypeBadge } from '#/components/shared/ReportTypeBadge'
import { useReports } from '#/hooks/reports'
import { getErrorMessage } from '#/api/client'
import { REPORT_TYPE_VALUES } from '#/api/reports'
import type { Report, ReportType } from '#/api/reports'

const TYPE_LABELS: Record<ReportType, string> = {
  blood_test: 'Blood test',
  xray: 'X-Ray',
  prescription: 'Prescription',
  scan: 'Scan',
  other: 'Other',
}

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
            <ReportTypeBadge type={report.type} />
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

export function ReportsPage() {
  const { data: reports, isLoading, isError, error } = useReports()
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('all')

  const filtered =
    typeFilter === 'all' ? reports : reports?.filter((r) => r.type === typeFilter)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <NativeSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ReportType | 'all')}
          className="max-w-45 [&_select]:h-11"
          aria-label="Filter by report type"
        >
          <NativeSelectOption value="all">All types</NativeSelectOption>
          {REPORT_TYPE_VALUES.map((type) => (
            <NativeSelectOption key={type} value={type}>
              {TYPE_LABELS[type]}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <Link to="/reports/upload" className={cn(buttonVariants(), 'ml-auto shrink-0')}>
          <PlusIcon className="size-4" />
          Upload
        </Link>
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

      {!isLoading && !isError && filtered?.length === 0 && typeFilter === 'all' && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpenIcon />
            </EmptyMedia>
            <EmptyTitle>No reports yet</EmptyTitle>
            <EmptyDescription>
              Your medical reports will appear here once you upload them.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to="/reports/upload" className={buttonVariants()}>
              Upload your first report
            </Link>
          </EmptyContent>
        </Empty>
      )}

      {!isLoading && !isError && filtered?.length === 0 && typeFilter !== 'all' && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpenIcon />
            </EmptyMedia>
            <EmptyTitle>No {TYPE_LABELS[typeFilter as ReportType].toLowerCase()} reports</EmptyTitle>
            <EmptyDescription>
              You don't have any reports of this type yet.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!isLoading && !isError && filtered && filtered.length > 0 && (
        <div className="flex flex-col gap-4">
          {filtered.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}
