import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CreateShareLinkPage } from '#/components/app/share/CreateShareLinkPage'

const searchSchema = z.object({
  type: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export const Route = createFileRoute('/_app/share/new')({
  validateSearch: searchSchema,
  component: CreateShareLinkPage,
})
