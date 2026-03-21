import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/api'
import type { CreateShareLinkRequest } from '@medi-track/types'

export const shareLinkKeys = {
  all: ['shareLinks'] as const,
  list: () => [...shareLinkKeys.all, 'list'] as const,
}

export function useShareLinks() {
  return useQuery({
    queryKey: shareLinkKeys.list(),
    queryFn: api.share.listShareLinks,
  })
}

export function useShareLinkStatus(token: string) {
  return useQuery({
    queryKey: ['shareLink', token, 'status'] as const,
    queryFn: () => api.share.checkShareLink(token),
    retry: 0,
    refetchOnWindowFocus: false,
  })
}

export function useVerifyShareLinkMutation() {
  return useMutation({
    mutationFn: ({ token, code }: { token: string; code: string }) =>
      api.share.verifyShareLink(token, code),
    retry: 0,
  })
}

export function useCreateShareLinkMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateShareLinkRequest) => api.share.createShareLink(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareLinkKeys.all })
    },
  })
}

export function useReactivateShareLinkMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, expiresIn }: { id: string; expiresIn: string }) =>
      api.share.reactivateShareLink(id, expiresIn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareLinkKeys.all })
    },
  })
}

export function useRevokeShareLinkMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.share.revokeShareLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareLinkKeys.all })
    },
  })
}

export function useSendShareLinkEmailMutation() {
  return useMutation({
    mutationFn: ({ id, recipientEmail }: { id: string; recipientEmail: string }) =>
      api.share.sendShareLinkEmail(id, recipientEmail),
  })
}
