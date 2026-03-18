import { Badge } from '#/components/ui/badge'
import type { ReportType } from '#/api/reports'

const REPORT_TYPE_CONFIG: Record<ReportType, { label: string; className: string }> = {
  blood_test: { label: 'Blood test', className: 'bg-chart-1/20 text-chart-5 border-chart-2/30' },
  xray: { label: 'X-Ray', className: 'bg-secondary text-secondary-foreground' },
  prescription: { label: 'Prescription', className: 'bg-primary/10 text-primary border-primary/20' },
  scan: { label: 'Scan', className: 'bg-accent text-accent-foreground' },
  other: { label: 'Other', className: 'bg-muted text-muted-foreground' },
}

export function ReportTypeBadge({ type }: { type: ReportType }) {
  const config = REPORT_TYPE_CONFIG[type]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
