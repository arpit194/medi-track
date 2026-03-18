import { z } from 'zod'

// --- Report type ---

export const ReportTypeSchema = z.enum(['blood_test', 'xray', 'prescription', 'scan', 'other'])
export type ReportType = z.infer<typeof ReportTypeSchema>

// --- User ---

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  dob: z.string(),
  bloodType: z.string(),
  gender: z.string(),
  createdAt: z.string(),
})
export type User = z.infer<typeof UserSchema>

// --- Report ---

export const ReportSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: ReportTypeSchema,
  title: z.string(),
  date: z.string(),
  doctorName: z.string(),
  notes: z.string(),
  files: z.array(z.string()),
  createdAt: z.string(),
})
export type Report = z.infer<typeof ReportSchema>

// --- ShareLink ---

export const ShareLinkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  reportIds: z.array(z.string()),
  label: z.string(),
  expiresAt: z.enum(['24h', '7d', '30d', 'one_time']),
  token: z.string(),
  isRevoked: z.boolean(),
  createdAt: z.string(),
})
export type ShareLink = z.infer<typeof ShareLinkSchema>
