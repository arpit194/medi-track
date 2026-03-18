import { Injectable } from '@nestjs/common'
import type { Report, ReportType } from '@medi-track/types'

export type CreateReportInput = {
  type: ReportType
  title: string
  date: string
  doctorName: string
  notes: string
  files: Express.Multer.File[]
}

export type UpdateReportInput = Partial<Omit<CreateReportInput, 'files'>>

@Injectable()
export class ReportsService {
  async listReports(_userId: string): Promise<Report[]> {
    throw new Error('Not implemented')
  }

  async getReport(_userId: string, _id: string): Promise<Report> {
    throw new Error('Not implemented')
  }

  async createReport(_userId: string, _input: CreateReportInput): Promise<Report> {
    throw new Error('Not implemented')
  }

  async updateReport(_userId: string, _id: string, _input: UpdateReportInput): Promise<Report> {
    throw new Error('Not implemented')
  }

  async deleteReport(_userId: string, _id: string): Promise<void> {
    throw new Error('Not implemented')
  }
}
