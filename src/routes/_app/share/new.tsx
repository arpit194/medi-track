import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/share/new')({ component: CreateShareLinkPage })

function CreateShareLinkPage() {
  return <div>Create Share Link</div>
}
