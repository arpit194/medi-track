import type { Report, PaginatedReports, ListReportsQuery } from '@medi-track/types'
import type { CreateReportRequest, UpdateReportRequest } from '@medi-track/types'
import { delay } from './_utils'

let MOCK_REPORTS: Report[] = [
  {
    id: 'report-1',
    userId: 'mock-user-1',
    type: 'Blood Test',
    title: 'Full Blood Count',
    date: '2025-11-10',
    doctorName: 'Dr. Sarah Mitchell',
    notes: 'All values within normal range. Haemoglobin 14.2 g/dL, WBC 6.8 × 10⁹/L. Follow-up recommended in 6 months.',
    files: [],
    createdAt: '2025-11-10T09:00:00Z',
    updatedAt: '2025-11-10T09:00:00Z',
  },
  {
    id: 'report-2',
    userId: 'mock-user-1',
    type: 'X-Ray',
    title: 'Chest X-Ray',
    date: '2025-10-03',
    doctorName: 'Dr. James Thornton',
    notes: 'No abnormalities detected. Lungs clear. Heart size normal.',
    files: [],
    createdAt: '2025-10-03T14:30:00Z',
    updatedAt: '2025-10-03T14:30:00Z',
  },
  {
    id: 'report-3',
    userId: 'mock-user-1',
    type: 'Prescription',
    title: 'Metformin 500mg',
    date: '2025-09-15',
    doctorName: 'Dr. Priya Nair',
    notes: 'Take once daily with evening meal. Review in 3 months. Do not skip doses.',
    files: [],
    createdAt: '2025-09-15T11:00:00Z',
    updatedAt: '2025-09-15T11:00:00Z',
  },
  {
    id: 'report-4',
    userId: 'mock-user-1',
    type: 'Ultrasound',
    title: 'Abdominal Ultrasound',
    date: '2025-08-22',
    doctorName: 'Dr. James Thornton',
    notes: 'Gallbladder and liver appear normal. No stones detected. Pancreas within normal limits.',
    files: [],
    createdAt: '2025-08-22T10:15:00Z',
    updatedAt: '2025-08-22T10:15:00Z',
  },
  {
    id: 'report-5',
    userId: 'mock-user-1',
    type: 'Blood Test',
    title: 'HbA1c & Lipid Panel',
    date: '2025-07-08',
    doctorName: 'Dr. Priya Nair',
    notes: 'HbA1c 6.2% — borderline. Total cholesterol 5.1 mmol/L. Diet review recommended.',
    files: [],
    createdAt: '2025-07-08T08:45:00Z',
    updatedAt: '2025-07-08T08:45:00Z',
  },
]

export async function getReportFilters() {
  await delay()
  const types = [...new Set(MOCK_REPORTS.map((r) => r.type))].sort()
  const dates = MOCK_REPORTS.map((r) => r.date).sort()
  return {
    types,
    dateRange: { min: dates[0] ?? null, max: dates[dates.length - 1] ?? null },
  }
}

export async function listReports(query: ListReportsQuery = {}): Promise<PaginatedReports> {
  await delay()
  const page = query.page ?? 1
  const limit = query.limit ?? 20

  let filtered = [...MOCK_REPORTS].sort((a, b) => b.date.localeCompare(a.date))

  if (query.type) {
    filtered = filtered.filter((r) => r.type.toLowerCase().includes(query.type!.toLowerCase()))
  }
  if (query.dateFrom) filtered = filtered.filter((r) => r.date >= query.dateFrom!)
  if (query.dateTo) filtered = filtered.filter((r) => r.date <= query.dateTo!)

  const total = filtered.length
  const data = filtered.slice((page - 1) * limit, page * limit)

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getReport(id: string): Promise<Report> {
  await delay()
  const report = MOCK_REPORTS.find((r) => r.id === id)
  if (!report) throw new Error('Report not found.')
  return report
}

export async function createReport(input: CreateReportRequest & { file: File }): Promise<Report> {
  await delay()
  const report: Report = {
    id: `report-${Date.now()}`,
    userId: 'mock-user-1',
    type: input.type,
    title: input.title,
    date: input.date,
    doctorName: input.doctorName,
    notes: input.notes ?? null,
    files: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  MOCK_REPORTS = [report, ...MOCK_REPORTS]
  return report
}

export async function replaceReportFile(id: string, _file: File): Promise<Report> {
  await delay()
  const report = MOCK_REPORTS.find((r) => r.id === id)
  if (!report) throw new Error('Report not found.')
  return report
}

export async function updateReport(id: string, input: UpdateReportRequest): Promise<Report> {
  await delay()
  const index = MOCK_REPORTS.findIndex((r) => r.id === id)
  if (index === -1) throw new Error('Report not found.')
  const updated = { ...MOCK_REPORTS[index]!, ...input, updatedAt: new Date().toISOString() }
  MOCK_REPORTS[index] = updated
  return updated
}

export async function deleteReport(id: string): Promise<void> {
  await delay()
  const exists = MOCK_REPORTS.some((r) => r.id === id)
  if (!exists) throw new Error('Report not found.')
  MOCK_REPORTS = MOCK_REPORTS.filter((r) => r.id !== id)
}
