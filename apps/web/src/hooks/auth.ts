import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '#/api'
import { TOKEN_KEY } from '#/api/client'
import { userKeys } from '#/hooks/user'

export function useSignupMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.auth.signup,
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token)
      queryClient.setQueryData(userKeys.current(), data.user)
    },
  })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.auth.login,
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token)
      queryClient.setQueryData(userKeys.current(), data.user)
    },
  })
}

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: api.auth.forgotPassword })
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: api.auth.resetPassword })
}

export function useVerifyEmailMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.auth.verifyEmail,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.current() })
    },
  })
}

export function useResendVerificationMutation() {
  return useMutation({ mutationFn: api.auth.resendVerificationEmail })
}

export function useSignoutMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async () => {
      await api.auth.logout()
      localStorage.removeItem(TOKEN_KEY)
      queryClient.clear()
    },
    onSuccess: () => navigate({ to: '/login' }),
  })
}
