import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '#/components/app/dashboard/DashboardPage'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})
