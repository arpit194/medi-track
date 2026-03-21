import type { Report, ReportFile } from '@medi-track/types'

type ReportFileRecord = {
  id: string
  key: string
  url: string
  name: string
  size: number
  createdAt: Date
}

type ReportRecord = {
  id: string
  userId: string
  type: string
  title: string
  date: string
  doctorName: string
  notes: string | null
  files: ReportFileRecord[]
  createdAt: Date
  updatedAt: Date
}

export function toReportFile(record: ReportFileRecord): ReportFile {
  return {
    id: record.id,
    key: record.key,
    url: record.url,
    name: record.name,
    size: record.size,
    createdAt: record.createdAt.toISOString(),
  }
}

export function toReport(record: ReportRecord): Report {
  return {
    id: record.id,
    userId: record.userId,
    type: record.type,
    title: record.title,
    date: record.date,
    doctorName: record.doctorName,
    notes: record.notes,
    files: record.files.map(toReportFile),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}
