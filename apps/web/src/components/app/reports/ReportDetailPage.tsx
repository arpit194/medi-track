import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, CalendarIcon, UserIcon, FileTextIcon, OctagonXIcon, PencilIcon, EyeIcon, DownloadIcon } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '#/components/ui/alert'
import { Separator } from '#/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#/components/ui/alert-dialog'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { useReport, useDeleteReportMutation } from '#/hooks/reports'
import { getErrorMessage } from '#/api/client'
import { ReportFileViewer } from '#/components/app/reports/ReportFileViewer'
import type { ReportFile } from '@medi-track/types'

function ReportDetailPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-4xl mx-auto">
      <Skeleton className="h-5 w-24" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
          <Separator />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  )
}

export function ReportDetailPage({ id }: { id: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: report, isLoading, isError, error } = useReport(id)
  const deleteMutation = useDeleteReportMutation()
  const [viewingFile, setViewingFile] = useState<ReportFile | null>(null)

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success(t('reports.detail.deleteSuccess'))
      navigate({ to: '/reports' })
    } catch {
      // error shown via deleteMutation.isError
    }
  }

  if (isLoading) return <ReportDetailPageSkeleton />

  if (isError || !report) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-4xl mx-auto">
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>{t('reports.detail.loadError')}</AlertTitle>
          <AlertDescription>{getErrorMessage(error)} {t('common.tryAgain')}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-4xl mx-auto">
      <Link
        to="/reports"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-2 w-fit')}
      >
        <ArrowLeftIcon className="size-4" />
        {t('reports.detail.backLink')}
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="wrap-break-word text-2xl font-medium">{report.title}</h1>
          <Badge>{report.type}</Badge>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/reports/$id/edit"
            params={{ id: report.id }}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <PencilIcon className="size-4" />
            {t('common.edit')}
          </Link>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
              {t('common.delete')}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('reports.detail.deleteHeading')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('reports.detail.deleteDescription', { title: report.title })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('reports.detail.keepIt')}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? t('reports.detail.deleting') : t('reports.detail.confirmDelete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {deleteMutation.isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>{t('reports.detail.deleteError')}</AlertTitle>
          <AlertDescription>
            {getErrorMessage(deleteMutation.error)} {t('common.tryAgain')}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">{t('reports.detail.detailsHeading')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-base">
            <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0">{format(new Date(report.date), 'dd MMMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-3 text-base">
            <UserIcon className="size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 wrap-break-word">{report.doctorName}</span>
          </div>

          {report.notes && (
            <>
              <Separator />
              <div className="flex gap-3">
                <FileTextIcon className="size-4 shrink-0 mt-1 text-muted-foreground" />
                <p className="min-w-0 wrap-break-word text-base leading-relaxed">{report.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {report.files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              {t('reports.detail.filesHeading', { count: report.files.length })}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {report.files.map((file) => (
              <div key={file.id} className="flex items-center justify-between gap-3">
                <span className="truncate text-base">{file.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingFile(file)}
                  >
                    <EyeIcon className="size-4" />
                    {t('reports.detail.view')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const blob = await fetch(file.url).then((r) => r.blob())
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = file.name
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <DownloadIcon className="size-4" />
                    {t('reports.detail.download')}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {viewingFile && (
        <ReportFileViewer
          file={viewingFile}
          open={!!viewingFile}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  )
}
