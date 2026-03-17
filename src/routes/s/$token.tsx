import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/s/$token')({ component: SharedReportPage })

function SharedReportPage() {
  return <div>Shared Report View</div>
}
