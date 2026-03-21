import { client } from './client'
import type { Report, ReportFilters, PaginatedReports, CreateReportRequest, UpdateReportRequest, ListReportsQuery } from '@medi-track/types'

export const REPORT_TYPE_SUGGESTIONS = [
  'Blood Test',
  'X-Ray',
  'Prescription',
  'MRI',
  'CT Scan',
  'Ultrasound',
  'ECG',
  'Pathology',
  'Other',
] as const

export async function getReportFilters(): Promise<ReportFilters> {
  const { data } = await client.get<ReportFilters>('/reports/filters')
  return data
}

export async function listReports(query: ListReportsQuery = {}): Promise<PaginatedReports> {
  const { data } = await client.get<PaginatedReports>('/reports', { params: query })
  return data
}

export async function getReport(id: string): Promise<Report> {
  const { data } = await client.get<Report>(`/reports/${id}`)
  return data
}

export async function createReport(input: CreateReportRequest & { file: File }): Promise<Report> {
  const form = new FormData()
  form.append('file', input.file)
  form.append('type', input.type)
  form.append('title', input.title)
  form.append('date', input.date)
  form.append('doctorName', input.doctorName)
  if (input.notes) form.append('notes', input.notes)
  const { data } = await client.post<Report>('/reports', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function replaceReportFile(id: string, file: File): Promise<Report> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await client.put<Report>(`/reports/${id}/file`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateReport(id: string, input: UpdateReportRequest): Promise<Report> {
  const { data } = await client.patch<Report>(`/reports/${id}`, input)
  return data
}

export async function deleteReport(id: string): Promise<void> {
  await client.delete(`/reports/${id}`)
}
