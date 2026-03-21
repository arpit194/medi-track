import type { ShareLink, PublicShareView, CreateShareLinkRequest } from '@medi-track/types'
import { delay } from './_utils'

let MOCK_SHARE_LINKS: ShareLink[] = []

export async function listShareLinks(): Promise<ShareLink[]> {
  await delay()
  return MOCK_SHARE_LINKS
}

export async function createShareLink(input: CreateShareLinkRequest): Promise<ShareLink> {
  await delay()
  const link: ShareLink = {
    id: `link-${Date.now()}`,
    userId: 'mock-user-1',
    reportIds: input.reportIds,
    label: input.label,
    token: `mock-token-${Date.now()}`,
    expiresIn: input.expiresIn,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isRevoked: false,
    createdAt: new Date().toISOString(),
  }
  MOCK_SHARE_LINKS = [link, ...MOCK_SHARE_LINKS]
  return link
}

export async function reactivateShareLink(id: string, expiresIn: string): Promise<ShareLink> {
  await delay()
  const link = MOCK_SHARE_LINKS.find((l) => l.id === id)
  if (!link) throw new Error('Share link not found.')
  const updated = { ...link, isRevoked: false, expiresIn: expiresIn as ShareLink['expiresIn'], expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
  MOCK_SHARE_LINKS = MOCK_SHARE_LINKS.map((l) => l.id === id ? updated : l)
  return updated
}

export async function revokeShareLink(id: string): Promise<void> {
  await delay()
  MOCK_SHARE_LINKS = MOCK_SHARE_LINKS.map((l) =>
    l.id === id ? { ...l, isRevoked: true } : l,
  )
}

export async function getPublicShareView(token: string): Promise<PublicShareView> {
  await delay()
  const link = MOCK_SHARE_LINKS.find((l) => l.token === token)
  if (!link || link.isRevoked) throw new Error('This link is invalid or has expired.')
  return { label: link.label, expiresAt: link.expiresAt, reports: [] }
}
