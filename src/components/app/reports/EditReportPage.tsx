import { useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, OctagonXIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from '@tanstack/react-form'
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
import { NativeSelect, NativeSelectOption } from '#/components/ui/native-select'
import { Alert, AlertTitle, AlertDescription } from '#/components/ui/alert'
import { Skeleton } from '#/components/ui/skeleton'
import { Card, CardContent } from '#/components/ui/card'
import { DatePicker } from '#/components/shared/DatePicker'
import { useReport, useUpdateReportMutation } from '#/hooks/reports'
import { getErrorMessage } from '#/api/client'
import { editReportSchema } from '#/lib/report-schemas'
import { REPORT_TYPE_VALUES } from '#/api/reports'
import type { Report, ReportType } from '#/api/reports'

const TYPE_LABELS: Record<ReportType, string> = {
  blood_test: 'Blood test',
  xray: 'X-Ray',
  prescription: 'Prescription',
  scan: 'Scan',
  other: 'Other',
}

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
  const navigate = useNavigate()
  const updateMutation = useUpdateReportMutation(report.id)

  const form = useForm({
    defaultValues: {
      type: report.type,
      title: report.title,
      date: report.date,
      doctorName: report.doctorName,
      notes: report.notes,
    },
    validators: { onChange: editReportSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync(value)
        toast.success('Report updated.')
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
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {getErrorMessage(updateMutation.error)} Please try again.
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
                <FieldLabel htmlFor={field.name}>Report type</FieldLabel>
                <NativeSelect
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value as ReportType)
                  }
                  onBlur={field.handleBlur}
                  className="w-full [&_select]:h-11"
                >
                  {REPORT_TYPE_VALUES.map((type) => (
                    <NativeSelectOption key={type} value={type}>
                      {TYPE_LABELS[type]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            )}
          </form.Field>

          <form.Field name="title">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Report title</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Report date</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Doctor's name</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Notes (optional)</FieldLabel>
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
                {isSubmitting ? 'Saving…' : 'Save changes'}
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
            Cancel
          </Link>
        </div>
      </form>
    </>
  )
}

export function EditReportPage({ id }: { id: string }) {
  const { data: report, isLoading, isError, error } = useReport(id)

  if (isLoading) return <EditReportPageSkeleton />

  if (isError || !report) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>Couldn't load this report</AlertTitle>
          <AlertDescription>
            {getErrorMessage(error)} Please try again.
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
        Back to report
      </Link>

      <h1 className="text-2xl font-medium">Edit report</h1>

      <EditReportForm report={report} />
    </div>
  )
}
