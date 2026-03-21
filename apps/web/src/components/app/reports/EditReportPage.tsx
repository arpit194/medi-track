import { useRef, useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, OctagonXIcon, UploadIcon, XIcon, LoaderCircleIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'
import { cn } from '#/lib/utils'
import { Button, buttonVariants } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Alert, AlertTitle, AlertDescription } from '#/components/ui/alert'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty } from '#/components/ui/combobox'
import { Skeleton } from '#/components/ui/skeleton'
import { Card, CardContent } from '#/components/ui/card'
import { DatePicker } from '#/components/shared/DatePicker'
import { useReport, useUpdateReportMutation, useReplaceReportFileMutation, useReportFilters } from '#/hooks/reports'
import { getErrorMessage } from '#/api/client'
import { createReportSchemas } from '#/lib/report-schemas'
import { compressImageIfNeeded } from '#/lib/compress-image'
import { REPORT_TYPE_SUGGESTIONS } from '#/api/reports'
import type { Report } from '@medi-track/types'

function EditReportPageSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-7 w-40" />
      <Card>
        <CardContent className="flex flex-col gap-5 pt-6">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

function EditReportForm({ report }: { report: Report }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const updateMutation = useUpdateReportMutation(report.id)
  const replaceFileMutation = useReplaceReportFileMutation(report.id)
  const { data: filters } = useReportFilters()
  const typeOptions = [...new Set([...REPORT_TYPE_SUGGESTIONS, ...(filters?.types ?? [])])]
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const { editReportSchema } = createReportSchemas(t)

  const form = useForm({
    defaultValues: {
      type: report.type,
      title: report.title,
      date: report.date,
      doctorName: report.doctorName,
      notes: report.notes ?? '',
    },
    validators: { onChange: editReportSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync(value)
        toast.success(t('reports.edit.updateSuccess'))
        navigate({ to: '/reports/$id', params: { id: report.id } })
      } catch {
        // error shown via updateMutation.isError
      }
    },
  })

  return (
    <>
      {updateMutation.isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>{t('reports.edit.updateError')}</AlertTitle>
          <AlertDescription>
            {getErrorMessage(updateMutation.error)} {t('common.tryAgain')}
          </AlertDescription>
        </Alert>
      )}

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        noValidate
      >
        <FieldGroup>
          <form.Field name="type">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{t('reports.edit.typeLabel')}</FieldLabel>
                <Combobox
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v ?? '')}
                >
                  <ComboboxInput
                    id={field.name}
                    showTrigger
                    showClear
                    placeholder={t('reports.edit.typePlaceholder')}
                    className="h-11 w-full"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                    aria-describedby={
                      field.state.meta.isTouched && field.state.meta.errors.length > 0
                        ? 'edit-type-error'
                        : undefined
                    }
                  />
                  <ComboboxContent>
                    <ComboboxList>
                      {typeOptions.map((type) => (
                        <ComboboxItem key={type} value={type}>
                          {type}
                        </ComboboxItem>
                      ))}
                      <ComboboxEmpty>{t('reports.edit.typeCustomHint')}</ComboboxEmpty>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <FieldError
                    id="edit-type-error"
                    errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
                  />
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="title">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{t('reports.edit.titleLabel')}</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-11"
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  aria-describedby={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? 'edit-title-error'
                      : undefined
                  }
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError
                      id="edit-title-error"
                      errors={field.state.meta.errors.map((e) => ({
                        message: e?.message,
                      }))}
                    />
                  )}
              </Field>
            )}
          </form.Field>

          <form.Field name="date">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{t('reports.edit.dateLabel')}</FieldLabel>
                <DatePicker
                  id={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  disableFuture
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  aria-describedby={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? 'edit-date-error'
                      : undefined
                  }
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError
                      id="edit-date-error"
                      errors={field.state.meta.errors.map((e) => ({
                        message: e?.message,
                      }))}
                    />
                  )}
              </Field>
            )}
          </form.Field>

          <form.Field name="doctorName">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{t('reports.edit.doctorLabel')}</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-11"
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  aria-describedby={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? 'edit-doctorName-error'
                      : undefined
                  }
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError
                      id="edit-doctorName-error"
                      errors={field.state.meta.errors.map((e) => ({
                        message: e?.message,
                      }))}
                    />
                  )}
              </Field>
            )}
          </form.Field>

          <form.Field name="notes">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{t('reports.edit.notesLabel')}</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={4}
                />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium">{t('reports.edit.attachmentLabel')}</span>
          {report.files.length > 0 && !pendingFile && (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2">
              <span className="truncate text-sm text-muted-foreground">{report.files[0]!.name}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                {t('reports.edit.replaceFile')}
              </Button>
            </div>
          )}
          {pendingFile && (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2">
              <span className="truncate text-sm">{pendingFile.name}</span>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={isCompressing || replaceFileMutation.isPending}
                  onClick={async () => {
                    try {
                      setIsCompressing(true)
                      const compressed = await compressImageIfNeeded(pendingFile)
                      setIsCompressing(false)
                      await replaceFileMutation.mutateAsync(compressed)
                      toast.success(t('reports.edit.fileReplaceSuccess'))
                      setPendingFile(null)
                    } catch {
                      setIsCompressing(false)
                      // error shown via replaceFileMutation.isError
                    }
                  }}
                >
                  {(isCompressing || replaceFileMutation.isPending) && <LoaderCircleIcon className="size-4 animate-spin" />}
                  {isCompressing ? t('reports.edit.compressing') : replaceFileMutation.isPending ? t('reports.edit.uploading') : t('reports.edit.uploadButton')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Cancel replacement"
                  className="size-7"
                  onClick={() => setPendingFile(null)}
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
          {replaceFileMutation.isError && (
            <p className="text-sm text-destructive">{getErrorMessage(replaceFileMutation.error)}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setPendingFile(file)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          />
          {report.files.length === 0 && !pendingFile && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-muted-foreground transition-colors hover:border-ring hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <UploadIcon className="size-6" />
              <span className="text-sm">{t('reports.edit.tapToAttach')}</span>
              <span className="text-xs">{t('reports.edit.fileTypesHelp')}</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={!canSubmit || !!isSubmitting}
              >
                {isSubmitting ? t('common.saving') : t('reports.edit.saveChanges')}
              </Button>
            )}
          </form.Subscribe>
          <Link
            to="/reports/$id"
            params={{ id: report.id }}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-full sm:w-auto',
            )}
          >
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </>
  )
}

export function EditReportPage({ id }: { id: string }) {
  const { t } = useTranslation()
  const { data: report, isLoading, isError, error } = useReport(id)

  if (isLoading) return <EditReportPageSkeleton />

  if (isError || !report) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>{t('reports.edit.loadError')}</AlertTitle>
          <AlertDescription>
            {getErrorMessage(error)} {t('common.tryAgain')}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
      <Link
        to="/reports/$id"
        params={{ id: report.id }}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          '-ml-2 w-fit',
        )}
      >
        <ArrowLeftIcon className="size-4" />
        {t('reports.edit.backLink')}
      </Link>

      <h1 className="text-2xl font-medium">{t('reports.edit.heading')}</h1>

      <EditReportForm report={report} />
    </div>
  )
}
