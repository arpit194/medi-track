import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/share/')({ component: ShareLinksPage })

function ShareLinksPage() {
  return <div>Share Links</div>
}
