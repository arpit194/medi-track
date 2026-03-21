import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/api'
import type { CreateShareLinkRequest } from '@medi-track/types'

export const shareLinkKeys = {
  all: ['shareLinks'] as const,
  list: () => [...shareLinkKeys.all, 'list'] as const,
  public: (token: string) => ['publicShare', token] as const,
}

export function useShareLinks() {
  return useQuery({
    queryKey: shareLinkKeys.list(),
    queryFn: api.share.listShareLinks,
  })
}

export function usePublicShareView(token: string) {
  return useQuery({
    queryKey: shareLinkKeys.public(token),
    queryFn: () => api.share.getPublicShareView(token),
    enabled: !!token,
    retry: 0,
    refetchOnWindowFocus: false,
    placeholderData: undefined,
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
