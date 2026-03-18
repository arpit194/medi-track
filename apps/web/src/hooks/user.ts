import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/api'

export const userKeys = {
  current: () => ['user', 'current'] as const,
}

export function useUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: api.user.getUser,
  })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.user.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({ mutationFn: api.user.changePassword })
}

export function useDeleteAccountMutation() {
  return useMutation({ mutationFn: api.user.deleteAccount })
}
