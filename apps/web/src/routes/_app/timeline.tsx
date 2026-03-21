import { createFileRoute } from '@tanstack/react-router'
import { TimelinePage } from '#/components/app/timeline/TimelinePage'

export const Route = createFileRoute('/_app/timeline')({
  component: TimelinePage,
})
