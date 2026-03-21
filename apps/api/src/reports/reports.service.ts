import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { UTApi } from 'uploadthing/server'
import type {
  Report,
  ReportFilters,
  PaginatedReports,
  CreateReportRequest,
  UpdateReportRequest,
  ListReportsQuery,
} from '@medi-track/types'
import { PrismaService } from '../prisma/prisma.service'
import { toReport } from '../common/utils/report.utils'

@Injectable()
export class ReportsService {
  private readonly utapi = new UTApi()

  constructor(private readonly prisma: PrismaService) {}

  async getReportFilters(userId: string): Promise<ReportFilters> {
    const where = { userId, deletedAt: null }

    const [typeRecords, dateRange] = await Promise.all([
      this.prisma.report.findMany({
        where,
        select: { type: true },
        distinct: ['type'],
        orderBy: { type: 'asc' },
      }),
      this.prisma.report.aggregate({
        where,
        _min: { date: true },
        _max: { date: true },
      }),
    ])

    return {
      types: typeRecords.map((r) => r.type),
      dateRange: {
        min: dateRange._min.date,
        max: dateRange._max.date,
      },
    }
  }

  async listReports(
    userId: string,
    query: ListReportsQuery,
  ): Promise<PaginatedReports> {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const skip = (page - 1) * limit

    const where = {
      userId,
      deletedAt: null,
      ...(query.type
        ? { type: { contains: query.type, mode: 'insensitive' as const } }
        : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' as const } },
              { doctorName: { contains: query.search, mode: 'insensitive' as const } },
              { notes: { contains: query.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(query.dateFrom || query.dateTo
        ? {
            date: {
              ...(query.dateFrom ? { gte: query.dateFrom } : {}),
              ...(query.dateTo ? { lte: query.dateTo } : {}),
            },
          }
        : {}),
    }

    const [records, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: { files: { where: { report: { deletedAt: null } } } },
        orderBy: { date: query.sortOrder ?? 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ])

    return {
      data: records.map(toReport),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getReport(userId: string, id: string): Promise<Report> {
    const record = await this.prisma.report.findUnique({
      where: { id, deletedAt: null },
      include: { files: true },
    })

    if (!record) throw new NotFoundException('Report not found.')
    if (record.userId !== userId)
      throw new ForbiddenException('You do not have access to this report.')

    return toReport(record)
  }

  async createReport(
    userId: string,
    input: CreateReportRequest,
    file: Express.Multer.File,
  ): Promise<Report> {
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype,
    })
    const uploaded = await this.utapi.uploadFiles(
      new File([blob], file.originalname, { type: file.mimetype }),
    )

    if (uploaded.error)
      throw new Error(`File upload failed: ${uploaded.error.message}`)

    const { key, ufsUrl: url, name, size } = uploaded.data

    const record = await this.prisma.report.create({
      data: {
        userId,
        type: input.type,
        title: input.title,
        date: input.date,
        doctorName: input.doctorName,
        notes: input.notes ?? null,
        files: {
          create: [{ key, url, name, size }],
        },
      },
      include: { files: true },
    })

    return toReport(record)
  }

  async replaceReportFile(
    userId: string,
    id: string,
    file: Express.Multer.File,
  ): Promise<Report> {
    const existing = await this.prisma.report.findUnique({
      where: { id, deletedAt: null },
      include: { files: true },
    })
    if (!existing) throw new NotFoundException('Report not found.')
    if (existing.userId !== userId)
      throw new ForbiddenException('You do not have access to this report.')

    if (existing.files.length > 0) {
      await this.utapi.deleteFiles(existing.files.map((f) => f.key))
      await this.prisma.reportFile.deleteMany({ where: { reportId: id } })
    }

    const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype })
    const uploaded = await this.utapi.uploadFiles(
      new File([blob], file.originalname, { type: file.mimetype }),
    )
    if (uploaded.error)
      throw new Error(`File upload failed: ${uploaded.error.message}`)

    const { key, ufsUrl: url, name, size } = uploaded.data
    const record = await this.prisma.report.update({
      where: { id },
      data: { files: { create: [{ key, url, name, size }] } },
      include: { files: true },
    })

    return toReport(record)
  }

  async updateReport(
    userId: string,
    id: string,
    input: UpdateReportRequest,
  ): Promise<Report> {
    const existing = await this.prisma.report.findUnique({
      where: { id, deletedAt: null },
    })
    if (!existing) throw new NotFoundException('Report not found.')
    if (existing.userId !== userId)
      throw new ForbiddenException('You do not have access to this report.')

    const record = await this.prisma.report.update({
      where: { id },
      data: input,
      include: { files: true },
    })

    return toReport(record)
  }

  async deleteReport(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.report.findUnique({
      where: { id, deletedAt: null },
      include: { files: true },
    })
    if (!existing) throw new NotFoundException('Report not found.')
    if (existing.userId !== userId)
      throw new ForbiddenException('You do not have access to this report.')

    if (existing.files.length > 0) {
      await this.utapi.deleteFiles(existing.files.map((f) => f.key))
    }

    await this.prisma.report.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
