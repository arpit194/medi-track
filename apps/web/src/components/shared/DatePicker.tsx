import { useState } from 'react'
import { format, parseISO, isValid } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '#/components/ui/calendar'
import { buttonVariants } from '#/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '#/components/ui/popover'
import { cn } from '#/lib/utils'

type DatePickerProps = {
  value: string // ISO "YYYY-MM-DD" or empty string
  onChange: (value: string) => void
  onBlur?: () => void
  id?: string
  placeholder?: string
  disabled?: boolean
  fromDate?: string // ISO "YYYY-MM-DD"
  toDate?: string   // ISO "YYYY-MM-DD"
  fromYear?: number
  toYear?: number
  disableFuture?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  id,
  placeholder = 'Pick a date',
  disabled = false,
  fromDate,
  toDate,
  fromYear,
  toYear,
  disableFuture = false,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const selected = value && isValid(parseISO(value)) ? parseISO(value) : undefined
  const currentYear = new Date().getFullYear()
  const parsedFromDate = fromDate && isValid(parseISO(fromDate)) ? parseISO(fromDate) : undefined
  const parsedToDate = toDate && isValid(parseISO(toDate)) ? parseISO(toDate) : undefined

  function isDisabled(date: Date): boolean {
    if (disableFuture && date > new Date()) return true
    if (parsedFromDate && date < parsedFromDate) return true
    if (parsedToDate && date > parsedToDate) return true
    return false
  }

  function handleSelect(date: Date | undefined) {
    onChange(date ? format(date, 'yyyy-MM-dd') : '')
    setOpen(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) onBlur?.()
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'w-full justify-start h-11 font-normal',
          !selected && 'text-muted-foreground',
        )}
      >
        <CalendarIcon className="size-4" />
        {selected ? format(selected, 'd MMM yyyy') : placeholder}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected ?? parsedFromDate}
          onSelect={handleSelect}
          captionLayout="dropdown"
          startMonth={parsedFromDate}
          endMonth={parsedToDate ?? (disableFuture ? new Date() : undefined)}
          fromYear={fromYear ?? (parsedFromDate?.getFullYear() ?? currentYear - 120)}
          toYear={toYear ?? (disableFuture ? currentYear : (parsedToDate?.getFullYear() ?? currentYear + 10))}
          disabled={isDisabled}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
