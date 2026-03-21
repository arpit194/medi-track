import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ShareLinksPage } from '#/components/app/share/ShareLinksPage'

const searchSchema = z.object({
  tab: z.enum(['active', 'inactive']).optional().default('active'),
})

export const Route = createFileRoute('/_app/share/')({
  validateSearch: searchSchema,
  component: ShareLinksPage,
})
