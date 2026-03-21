import { useRef, useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, LoaderCircleIcon, OctagonXIcon, UploadIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from '@tanstack/react-form'
import { cn } from '#/lib/utils'
import { buttonVariants } from '#/components/ui/button'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Alert, AlertTitle, AlertDescription } from '#/components/ui/alert'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty } from '#/components/ui/combobox'
import { DatePicker } from '#/components/shared/DatePicker'
import { useCreateReportMutation, useReportFilters } from '#/hooks/reports'
import { getErrorMessage } from '#/api/client'
import { uploadReportSchema } from '#/lib/report-schemas'
import { compressImageIfNeeded } from '#/lib/compress-image'
import { REPORT_TYPE_SUGGESTIONS } from '#/api/reports'

export function UploadReportPage() {
  const navigate = useNavigate()
  const createMutation = useCreateReportMutation()
  const { data: filters } = useReportFilters()
  const typeOptions = [...new Set([...REPORT_TYPE_SUGGESTIONS, ...(filters?.types ?? [])])]
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const form = useForm({
    defaultValues: {
      type: 'Blood Test',
      title: '',
      date: '',
      doctorName: '',
      notes: '',
    },
    validators: { onChange: uploadReportSchema },
    onSubmit: async ({ value }) => {
      if (!file) {
        setFileError('Please attach a file for this report.')
        return
      }
      try {
        setIsCompressing(true)
        const compressed = await compressImageIfNeeded(file!)
        setIsCompressing(false)
        await createMutation.mutateAsync({ ...value, file: compressed })
        toast.success('Report uploaded successfully.')
        navigate({ to: '/reports' })
      } catch {
        setIsCompressing(false)
        // error shown via createMutation.isError
      }
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
    if (selected) setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeFile() {
    setFile(null)
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
                <Combobox
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v ?? '')}
                >
                  <ComboboxInput
                    id={field.name}
                    showTrigger
                    showClear
                    placeholder="e.g. Blood Test"
                    className="h-11 w-full"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                    aria-describedby={
                      field.state.meta.isTouched && field.state.meta.errors.length > 0
                        ? 'type-error'
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
                      <ComboboxEmpty>Press Enter to use your own type</ComboboxEmpty>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <FieldError
                    id="type-error"
                    errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
                  />
                )}
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
          <span className="text-sm font-medium">Attachment</span>
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
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
          {file && (
            <ul className="flex flex-col gap-2">
              <li className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2">
                <span className="truncate text-sm">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${file.name}`}
                  className="size-7 shrink-0"
                  onClick={removeFile}
                >
                  <XIcon className="size-4" />
                </Button>
              </li>
            </ul>
          )}
          {fileError && (
            <p className="text-sm text-destructive">{fileError}</p>
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
                {(isCompressing || !!isSubmitting) && <LoaderCircleIcon className="size-4 animate-spin" />}
                {isCompressing ? 'Compressing…' : isSubmitting ? 'Uploading…' : 'Upload report'}
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
