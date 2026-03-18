import { createFileRoute } from '@tanstack/react-router'
import { ReportsPage } from '#/components/app/reports/ReportsPage'

export const Route = createFileRoute('/_app/reports/')({
  component: ReportsPage,
})
