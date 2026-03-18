import { useRef, useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, OctagonXIcon, UploadIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from '@tanstack/react-form'
import { cn } from '#/lib/utils'
import { buttonVariants } from '#/components/ui/button'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { NativeSelect, NativeSelectOption } from '#/components/ui/native-select'
import { Alert, AlertTitle, AlertDescription } from '#/components/ui/alert'
import { DatePicker } from '#/components/shared/DatePicker'
import { useCreateReportMutation } from '#/hooks/reports'
import { getErrorMessage } from '#/api/client'
import { uploadReportSchema } from '#/lib/report-schemas'
import { REPORT_TYPE_VALUES } from '#/api/reports'
import type { ReportType } from '#/api/reports'

const TYPE_LABELS: Record<ReportType, string> = {
  blood_test: 'Blood test',
  xray: 'X-Ray',
  prescription: 'Prescription',
  scan: 'Scan',
  other: 'Other',
}

export function UploadReportPage() {
  const navigate = useNavigate()
  const createMutation = useCreateReportMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])

  const form = useForm({
    defaultValues: {
      type: 'blood_test' as ReportType,
      title: '',
      date: '',
      doctorName: '',
      notes: '',
    },
    validators: { onChange: uploadReportSchema },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({ ...value, files })
        toast.success('Report uploaded successfully.')
        navigate({ to: '/reports' })
      } catch {
        // error shown via createMutation.isError
      }
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    setFiles((prev) => [...prev, ...selected])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
      <Link
        to="/reports"
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-2 w-fit')}
      >
        <ArrowLeftIcon className="size-4" />
        All reports
      </Link>

      <h1 className="text-2xl font-medium">Upload a report</h1>

      {createMutation.isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {getErrorMessage(createMutation.error)} Please try again.
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
                  onChange={(e) => field.handleChange(e.target.value as ReportType)}
                  onBlur={field.handleBlur}
                  className="w-full [&_select]:h-11"
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
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
                  placeholder="e.g. Full Blood Count"
                  className="h-11"
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                  aria-describedby={
                    field.state.meta.isTouched && field.state.meta.errors.length > 0
                      ? 'title-error'
                      : undefined
                  }
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <FieldError
                    id="title-error"
                    errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
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
                  placeholder="Select date"
                  disableFuture
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                  aria-describedby={
                    field.state.meta.isTouched && field.state.meta.errors.length > 0
                      ? 'date-error'
                      : undefined
                  }
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <FieldError
                    id="date-error"
                    errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
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
                  placeholder="e.g. Dr. Sarah Mitchell"
                  className="h-11"
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                  aria-describedby={
                    field.state.meta.isTouched && field.state.meta.errors.length > 0
                      ? 'doctorName-error'
                      : undefined
                  }
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <FieldError
                    id="doctorName-error"
                    errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
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
                  placeholder="Any observations, instructions, or context from the doctor."
                  rows={4}
                />
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        {/* File upload */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium">Attachments (optional)</span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-6 text-muted-foreground transition-colors hover:border-ring hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <UploadIcon className="size-6" />
            <span className="text-sm">Tap to attach files</span>
            <span className="text-xs">PDF, JPG, PNG up to 10 MB each</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
          {files.length > 0 && (
            <ul className="flex flex-col gap-2">
              {files.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2"
                >
                  <span className="truncate text-sm">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${file.name}`}
                    className="size-7 shrink-0"
                    onClick={() => removeFile(i)}
                  >
                    <XIcon className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={!canSubmit || !!isSubmitting}
              >
                {isSubmitting ? 'Uploading…' : 'Upload report'}
              </Button>
            )}
          </form.Subscribe>
          <Link
            to="/reports"
            className={cn(buttonVariants({ variant: 'outline' }), 'w-full sm:w-auto')}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
