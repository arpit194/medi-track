import { Injectable, NotFoundException, ForbiddenException, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'
import type { ShareLink, PublicShareView, CreateShareLinkRequest, ShareLinkExpiryOption } from '@medi-track/types'
import { PrismaService } from '../prisma/prisma.service'
import { EmailService } from '../email/email.service'
import { toReport } from '../common/utils/report.utils'

type ShareLinkRecord = {
  id: string
  userId: string
  reportIds: string[]
  label: string
  token: string
  expiresIn: string
  expiresAt: Date
  isRevoked: boolean
  createdAt: Date
  _count?: { views: number }
}

function toShareLink(record: ShareLinkRecord, accessCode: string): ShareLink {
  return {
    id: record.id,
    userId: record.userId,
    reportIds: record.reportIds,
    label: record.label,
    token: record.token,
    accessCode,
    expiresIn: record.expiresIn as ShareLinkExpiryOption,
    expiresAt: record.expiresAt.toISOString(),
    isRevoked: record.isRevoked,
    viewCount: record._count?.views ?? 0,
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly config: ConfigService,
  ) {}

  private deriveCode(id: string): string {
    const secret = this.config.getOrThrow<string>('SHARE_LINK_SECRET')
    return crypto.createHmac('sha256', secret).update(id).digest('hex').slice(0, 8).toUpperCase()
  }

  async listShareLinks(userId: string): Promise<ShareLink[]> {
    const records = await this.prisma.shareLink.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { views: true } } },
    })
    return records.map((r) => toShareLink(r, this.deriveCode(r.id)))
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
      include: { _count: { select: { views: true } } },
    })

    return toShareLink(record, this.deriveCode(record.id))
  }

  async reactivateShareLink(userId: string, id: string, expiresIn: ShareLinkExpiryOption): Promise<ShareLink> {
    const existing = await this.prisma.shareLink.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Share link not found.')
    if (existing.userId !== userId) throw new ForbiddenException('You do not have access to this link.')

    const expiresAt = computeExpiry(expiresIn)
    const record = await this.prisma.shareLink.update({
      where: { id },
      data: { isRevoked: false, expiresIn, expiresAt },
      include: { _count: { select: { views: true } } },
    })
    return toShareLink(record, this.deriveCode(record.id))
  }

  async revokeShareLink(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.shareLink.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Share link not found.')
    if (existing.userId !== userId) throw new ForbiddenException('You do not have access to this link.')

    await this.prisma.shareLink.update({ where: { id }, data: { isRevoked: true } })
  }

  async checkShareLink(token: string): Promise<void> {
    const shareLink = await this.prisma.shareLink.findUnique({ where: { token } })
    if (!shareLink || shareLink.isRevoked || shareLink.expiresAt < new Date()) {
      throw new NotFoundException('This link is invalid or has expired.')
    }
  }

  async getPublicShareView(token: string, code: string): Promise<PublicShareView> {
    const shareLink = await this.prisma.shareLink.findUnique({ where: { token } })

    if (!shareLink || shareLink.isRevoked || shareLink.expiresAt < new Date()) {
      throw new NotFoundException('This link is invalid or has expired.')
    }

    if (code.toUpperCase() !== this.deriveCode(shareLink.id)) {
      throw new UnauthorizedException('Incorrect access code.')
    }

    const reports = await this.prisma.report.findMany({
      where: { id: { in: shareLink.reportIds }, deletedAt: null },
      include: { files: true },
      orderBy: { date: 'desc' },
    })

    await this.prisma.shareLinkView.create({ data: { shareLinkId: shareLink.id } })

    if (shareLink.expiresIn === 'one_time') {
      await this.prisma.shareLink.update({ where: { id: shareLink.id }, data: { isRevoked: true } })
    }

    return {
      label: shareLink.label,
      expiresAt: shareLink.expiresAt.toISOString(),
      reports: reports.map(toReport),
    }
  }

  async sendShareLinkEmail(userId: string, id: string, recipientEmail: string): Promise<void> {
    const shareLink = await this.prisma.shareLink.findUnique({ where: { id } })
    if (!shareLink) throw new NotFoundException('Share link not found.')
    if (shareLink.userId !== userId) throw new ForbiddenException('You do not have access to this link.')
    if (shareLink.isRevoked || shareLink.expiresAt < new Date()) {
      throw new BadRequestException('This link is no longer active.')
    }

    const sender = await this.prisma.user.findUnique({ where: { id: userId } })
    const code = this.deriveCode(shareLink.id)
    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL').split(',')[0]
    const shareUrl = `${frontendUrl}/s/${shareLink.token}`

    await this.email.sendShareLinkInvite(recipientEmail, sender!.name, shareUrl, code, shareLink.label)
  }
}
