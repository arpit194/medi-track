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

export async function checkShareLink(token: string): Promise<{ valid: boolean }> {
  const { data } = await client.get<{ valid: boolean }>(`/s/${token}`)
  return data
}

export async function verifyShareLink(token: string, code: string): Promise<PublicShareView> {
  const { data } = await client.post<PublicShareView>(`/s/${token}`, { code })
  return data
}

export async function sendShareLinkEmail(id: string, recipientEmail: string): Promise<void> {
  await client.post(`/share/${id}/send-email`, { recipientEmail })
}
