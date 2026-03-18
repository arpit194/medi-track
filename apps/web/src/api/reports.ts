import { client } from './client'

export const REPORT_TYPE_VALUES = [
  'blood_test',
  'xray',
  'prescription',
  'scan',
  'other',
] as const

export type ReportType = (typeof REPORT_TYPE_VALUES)[number]

export type Report = {
  id: string
  userId: string
  type: ReportType
  title: string
  date: string
  doctorName: string
  notes: string
  files: string[]
  createdAt: string
}

export type CreateReportInput = {
  type: ReportType
  title: string
  date: string
  doctorName: string
  notes: string
  files: File[]
}

export type UpdateReportInput = Partial<Omit<CreateReportInput, 'files'>>

export async function listReports(): Promise<Report[]> {
  const { data } = await client.get<Report[]>('/reports')
  return data
}

export async function getReport(id: string): Promise<Report> {
  const { data } = await client.get<Report>(`/reports/${id}`)
  return data
}

export async function createReport(input: CreateReportInput): Promise<Report> {
  const form = new FormData()
  form.append('type', input.type)
  form.append('title', input.title)
  form.append('date', input.date)
  form.append('doctorName', input.doctorName)
  form.append('notes', input.notes)
  input.files.forEach((f) => form.append('files', f))
  const { data } = await client.post<Report>('/reports', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateReport(id: string, input: UpdateReportInput): Promise<Report> {
  const { data } = await client.patch<Report>(`/reports/${id}`, input)
  return data
}

export async function deleteReport(id: string): Promise<void> {
  await client.delete(`/reports/${id}`)
}
