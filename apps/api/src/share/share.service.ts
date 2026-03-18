import { Injectable } from '@nestjs/common'
import type { ShareLink, Report } from '@medi-track/types'

export type CreateShareLinkInput = {
  reportIds: string[]
  label: string
  expiresAt: '24h' | '7d' | '30d' | 'one_time'
}

export type PublicShareView = {
  shareLink: ShareLink
  reports: Report[]
}

@Injectable()
export class ShareService {
  async listShareLinks(_userId: string): Promise<ShareLink[]> {
    throw new Error('Not implemented')
  }

  async createShareLink(_userId: string, _input: CreateShareLinkInput): Promise<ShareLink> {
    throw new Error('Not implemented')
  }

  async revokeShareLink(_userId: string, _id: string): Promise<void> {
    throw new Error('Not implemented')
  }

  async getPublicShareView(_token: string): Promise<PublicShareView> {
    throw new Error('Not implemented')
  }
}
