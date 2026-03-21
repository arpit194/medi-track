import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import * as crypto from 'crypto'
import type { ShareLink, PublicShareView, CreateShareLinkRequest, ShareLinkExpiryOption } from '@medi-track/types'
import { PrismaService } from '../prisma/prisma.service'
import { toReport } from '../common/utils/report.utils'

function toShareLink(record: {
  id: string
  userId: string
  reportIds: string[]
  label: string
  token: string
  expiresIn: string
  expiresAt: Date
  isRevoked: boolean
  createdAt: Date
}): ShareLink {
  return {
    id: record.id,
    userId: record.userId,
    reportIds: record.reportIds,
    label: record.label,
    token: record.token,
    expiresIn: record.expiresIn as ShareLinkExpiryOption,
    expiresAt: record.expiresAt.toISOString(),
    isRevoked: record.isRevoked,
    createdAt: record.createdAt.toISOString(),
  }
}

function computeExpiry(expiresIn: ShareLinkExpiryOption): Date {
  const now = Date.now()
  if (expiresIn === '24h') return new Date(now + 24 * 60 * 60 * 1000)
  if (expiresIn === '7d') return new Date(now + 7 * 24 * 60 * 60 * 1000)
  if (expiresIn === '30d') return new Date(now + 30 * 24 * 60 * 60 * 1000)
  // one_time — expires in 90 days, revoked on first view
  return new Date(now + 90 * 24 * 60 * 60 * 1000)
}

@Injectable()
export class ShareService {
  constructor(private readonly prisma: PrismaService) {}

  async listShareLinks(userId: string): Promise<ShareLink[]> {
    const records = await this.prisma.shareLink.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return records.map(toShareLink)
  }

  async createShareLink(userId: string, input: CreateShareLinkRequest): Promise<ShareLink> {
    const reports = await this.prisma.report.findMany({
      where: { id: { in: input.reportIds }, userId, deletedAt: null },
      select: { id: true },
    })

    if (reports.length !== input.reportIds.length) {
      throw new BadRequestException('One or more selected reports were not found.')
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = computeExpiry(input.expiresIn)

    const record = await this.prisma.shareLink.create({
      data: {
        userId,
        reportIds: input.reportIds,
        label: input.label,
        token,
        expiresIn: input.expiresIn,
        expiresAt,
      },
    })

    return toShareLink(record)
  }

  async reactivateShareLink(userId: string, id: string, expiresIn: ShareLinkExpiryOption): Promise<ShareLink> {
    const existing = await this.prisma.shareLink.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Share link not found.')
    if (existing.userId !== userId) throw new ForbiddenException('You do not have access to this link.')

    const expiresAt = computeExpiry(expiresIn)
    const record = await this.prisma.shareLink.update({
      where: { id },
      data: { isRevoked: false, expiresIn, expiresAt },
    })
    return toShareLink(record)
  }

  async revokeShareLink(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.shareLink.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Share link not found.')
    if (existing.userId !== userId) throw new ForbiddenException('You do not have access to this link.')

    await this.prisma.shareLink.update({ where: { id }, data: { isRevoked: true } })
  }

  async getPublicShareView(token: string): Promise<PublicShareView> {
    const shareLink = await this.prisma.shareLink.findUnique({ where: { token } })

    if (!shareLink || shareLink.isRevoked || shareLink.expiresAt < new Date()) {
      throw new NotFoundException('This link is invalid or has expired.')
    }

    const reports = await this.prisma.report.findMany({
      where: { id: { in: shareLink.reportIds }, deletedAt: null },
      include: { files: true },
      orderBy: { date: 'desc' },
    })

    if (shareLink.expiresIn === 'one_time') {
      await this.prisma.shareLink.update({ where: { id: shareLink.id }, data: { isRevoked: true } })
    }

    return {
      label: shareLink.label,
      expiresAt: shareLink.expiresAt.toISOString(),
      reports: reports.map(toReport),
    }
  }
}
