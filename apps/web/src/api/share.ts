import type { ShareLink, PublicShareView, CreateShareLinkRequest } from '@medi-track/types'
import { client } from './client'

export async function listShareLinks(): Promise<ShareLink[]> {
  const { data } = await client.get<ShareLink[]>('/share')
  return data
}

export async function createShareLink(input: CreateShareLinkRequest): Promise<ShareLink> {
  const { data } = await client.post<ShareLink>('/share', input)
  return data
}

export async function reactivateShareLink(id: string, expiresIn: string): Promise<ShareLink> {
  const { data } = await client.patch<ShareLink>(`/share/${id}/reactivate`, { expiresIn })
  return data
}

export async function revokeShareLink(id: string): Promise<void> {
  await client.delete(`/share/${id}`)
}

export async function getPublicShareView(token: string): Promise<PublicShareView> {
  const { data } = await client.get<PublicShareView>(`/s/${token}`)
  return data
}
