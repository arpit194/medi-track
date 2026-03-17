import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/reports/')({ component: ReportsPage })

function ReportsPage() {
  return <div>All Reports</div>
}
