import { useState, useMemo } from 'react'
import { useNavigate, Link, useSearch } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import {
  CopyIcon,
  CheckIcon,
  OctagonXIcon,
  ChevronLeftIcon,
} from 'lucide-react'
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { createShareSchemas } from '#/lib/share-schemas'
import { getErrorMessage } from '#/api/client'
import { useCreateShareLinkMutation } from '#/hooks/share'
import { useReports, useReportFilters } from '#/hooks/reports'
import { Button, buttonVariants } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { NativeSelect, NativeSelectOption } from '#/components/ui/native-select'
import { DatePicker } from '#/components/shared/DatePicker'
import { Badge } from '#/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Skeleton } from '#/components/ui/skeleton'
import { cn } from '#/lib/utils'
import type { Report, ShareLink } from '@medi-track/types'

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

function CreatedLinkCard({ link }: { link: ShareLink }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/s/${link.token}`
  const navigate = useNavigate()

  function copyLink() {
    void navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success(t('share.create.copied'))
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <p className="text-lg font-medium">{t('share.create.successHeading')}</p>
        <p className="text-muted-foreground leading-relaxed">
          {t('share.create.successDescription')}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{link.label}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <span className="flex-1 truncate text-sm font-mono text-muted-foreground">
              {shareUrl}
            </span>
            <button
              onClick={copyLink}
              aria-label="Copy link"
              className="shrink-0 min-h-11 min-w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? (
                <CheckIcon className="size-4 text-primary" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('common.reportCount_other', { count: link.reportIds.length })}{' '}
            {link.expiresIn === 'one_time'
              ? `· ${t('share.create.oneTimeOnly')}`
              : `· ${t('share.create.expiresOn', { date: format(new Date(link.expiresAt), 'd MMM yyyy') })}`}
          </p>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full" onClick={copyLink}>
          {copied ? (
            <CheckIcon className="size-4" />
          ) : (
            <CopyIcon className="size-4" />
          )}
          {copied ? t('share.create.copied') : t('share.copyLink')}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => void navigate({ to: '/share' })}
        >
          {t('share.create.viewAllLinks')}
        </Button>
      </div>
    </div>
  )
}

type ReportPickerProps = {
  selectedIds: string[]
  onChange: (ids: string[]) => void
  error?: string
}

function ReportPicker({ selectedIds, onChange, error }: ReportPickerProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { type: typeFilter = '', dateFrom, dateTo } = useSearch({ from: '/_app/share/new' })
  const [search, setSearch] = useState('')
  const { data: reportsData, isLoading } = useReports({ limit: 500, sortOrder: 'desc' })
  const { data: filters } = useReportFilters()

  function setQueryFilter(updates: Record<string, string | undefined>) {
    void navigate({ to: '/share/new', search: (prev) => ({ ...prev, ...updates }), replace: true })
  }

  const visible = useMemo(() => {
    let all = reportsData?.data ?? []
    if (typeFilter) all = all.filter((r) => r.type === typeFilter)
    if (dateFrom) all = all.filter((r) => {
      const d = parseISO(r.date)
      const from = parseISO(dateFrom)
      return isAfter(d, from) || isEqual(d, from)
    })
    if (dateTo) all = all.filter((r) => {
      const d = parseISO(r.date)
      const to = parseISO(dateTo)
      return isBefore(d, to) || isEqual(d, to)
    })
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      all = all.filter((r) =>
        r.title.toLowerCase().includes(q) || r.doctorName.toLowerCase().includes(q),
      )
    }
    return all
  }, [reportsData, typeFilter, dateFrom, dateTo, search])

  const groups = useMemo(() => groupReports(visible), [visible])

  const allVisibleSelected = visible.length > 0 && visible.every((r) => selectedIds.includes(r.id))
  const someVisibleSelected = visible.some((r) => selectedIds.includes(r.id))
  const hasFilters = !!typeFilter || !!dateFrom || !!dateTo || !!search.trim()

  function toggleSelectAll() {
    if (allVisibleSelected) {
      onChange(selectedIds.filter((id) => !visible.some((r) => r.id === id)))
    } else {
      const toAdd = visible.map((r) => r.id).filter((id) => !selectedIds.includes(id))
      onChange([...selectedIds, ...toAdd])
    }
  }

  function toggleReport(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <Field>
      <FieldLabel>{t('share.create.reportsField')}</FieldLabel>

      {error && (
        <FieldError id="reportIds-error" errors={[{ message: error }]} />
      )}

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!isLoading && reportsData?.data.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">
          {t('share.create.noReportsUploaded')}{' '}
          <Link to="/reports/upload" className="underline underline-offset-4 text-foreground">
            {t('share.create.uploadFirst')}
          </Link>
        </p>
      )}

      {!isLoading && (reportsData?.data.length ?? 0) > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('share.create.searchPlaceholder')}
              className="h-11"
            />
            <div className="grid grid-cols-3 gap-2">
              <NativeSelect
                value={typeFilter}
                onChange={(e) => setQueryFilter({ type: e.target.value || undefined })}
                aria-label="Filter by type"
                className="w-full [&_select]:h-full"
              >
                <NativeSelectOption value="">{t('common.allTypes')}</NativeSelectOption>
                {filters?.types.map((type) => (
                  <NativeSelectOption key={type} value={type}>{type}</NativeSelectOption>
                ))}
              </NativeSelect>
              <DatePicker
                value={dateFrom ?? filters?.dateRange.min ?? ''}
                onChange={(v) => setQueryFilter({ dateFrom: v || undefined })}
                placeholder={t('share.create.fromDate')}
                fromDate={filters?.dateRange.min ?? undefined}
                toDate={dateTo ?? filters?.dateRange.max ?? undefined}
              />
              <DatePicker
                value={dateTo ?? filters?.dateRange.max ?? ''}
                onChange={(v) => setQueryFilter({ dateTo: v || undefined })}
                placeholder={t('share.create.toDate')}
                fromDate={dateFrom ?? filters?.dateRange.min ?? undefined}
                toDate={filters?.dateRange.max ?? undefined}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={toggleSelectAll}
            className="flex items-center gap-3 select-none w-full text-left"
          >
            <Checkbox
              checked={allVisibleSelected}
              indeterminate={someVisibleSelected && !allVisibleSelected}
              tabIndex={-1}
              aria-hidden
            />
            <span className="text-sm font-medium">
              {allVisibleSelected
                ? hasFilters ? t('share.create.deselectAll') : t('share.create.deselectAll')
                : hasFilters ? t('share.create.selectAllMatching') : t('share.create.selectAll')}
            </span>
            {selectedIds.length > 0 && (
              <span className="ml-auto text-sm text-muted-foreground">
                {t('share.create.selectedCount', { count: selectedIds.length })}
              </span>
            )}
          </button>

          {groups.map(({ year, months }) => (
            <div key={year} className="flex flex-col">
              <div className="flex items-center gap-3 py-1">
                <span className="text-sm font-semibold text-foreground">
                  {year}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="mt-2 flex flex-col">
                {months.map(({ month, reports }) => (
                  <div key={month} className="relative flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className="mt-1 size-2 shrink-0 rounded-full bg-primary/50 ring-2 ring-background ring-offset-1" />
                      <div className="mt-1 w-px flex-1 bg-border" />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 pb-4">
                      <span className="text-sm font-medium text-muted-foreground leading-none">
                        {month}
                      </span>
                      {reports.map((report) => {
                        const checked = selectedIds.includes(report.id)
                        return (
                          <button
                            key={report.id}
                            type="button"
                            onClick={() => toggleReport(report.id)}
                            className={cn(
                              'flex items-start gap-3 rounded-lg border p-3 w-full text-left transition-colors',
                              checked
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:bg-accent',
                            )}
                          >
                            <Checkbox
                              checked={checked}
                              tabIndex={-1}
                              aria-hidden
                              className="mt-0.5 shrink-0"
                            />
                            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-medium leading-snug">
                                  {report.title}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="shrink-0 text-xs"
                                >
                                  {report.type}
                                </Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {report.doctorName} ·{' '}
                                {format(new Date(report.date), 'd MMM yyyy')}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {visible.length === 0 && typeFilter && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t('share.create.noReportsForType')}
            </p>
          )}
        </div>
      )}
    </Field>
  )
}

export function CreateShareLinkPage() {
  const { t } = useTranslation()
  const createMutation = useCreateShareLinkMutation()
  const { createShareLinkSchema } = createShareSchemas(t)

  const EXPIRY_OPTIONS = [
    { value: '24h', label: t('expiry.24h') },
    { value: '7d', label: t('expiry.7d') },
    { value: '30d', label: t('expiry.30d') },
    { value: 'one_time', label: t('expiry.one_time') },
  ] as const

  const form = useForm({
    defaultValues: {
      label: '',
      expiresIn: '7d' as string,
      reportIds: [] as string[],
    },
    validators: {
      onMount: createShareLinkSchema,
      onChange: createShareLinkSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          label: value.label,
          expiresIn: value.expiresIn as '24h' | '7d' | '30d' | 'one_time',
          reportIds: value.reportIds,
        })
      } catch {
        // error displayed via createMutation.isError
      }
    },
  })

  if (createMutation.isSuccess && createMutation.data) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
        <CreatedLinkCard link={createMutation.data} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          to="/share"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'min-h-11 min-w-11',
          )}
          aria-label="Back"
        >
          <ChevronLeftIcon className="size-4" />
        </Link>
        <h1 className="font-serif text-2xl font-medium">{t('share.create.heading')}</h1>
      </div>

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        noValidate
      >
        {createMutation.isError && (
          <Alert variant="destructive">
            <OctagonXIcon className="size-4" />
            <AlertTitle>{t('share.create.error')}</AlertTitle>
            <AlertDescription>
              {getErrorMessage(createMutation.error)}
            </AlertDescription>
          </Alert>
        )}

        <FieldGroup>
          <form.Field name="label">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{t('share.create.labelField')}</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder={t('share.create.labelPlaceholder')}
                  className="h-11"
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  aria-describedby={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? 'label-error'
                      : undefined
                  }
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError
                      id="label-error"
                      errors={field.state.meta.errors.map((e) => ({
                        message: e?.message,
                      }))}
                    />
                  )}
              </Field>
            )}
          </form.Field>

          <form.Field name="expiresIn">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{t('share.create.expiryField')}</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) => { if (v) field.handleChange(v) }}
                >
                  <SelectTrigger id={field.name} className="data-[size=default]:h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPIRY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <form.Field name="reportIds">
          {(field) => (
            <ReportPicker
              selectedIds={field.state.value}
              onChange={field.handleChange}
              error={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? field.state.meta.errors[0]?.message
                  : undefined
              }
            />
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!canSubmit || !!isSubmitting}
            >
              {isSubmitting ? t('share.create.creating') : t('share.create.submitButton')}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}
