import { useMutation } from '@tanstack/react-query'
import { api } from '#/api'

export function useLoginMutation() {
  return useMutation({ mutationFn: api.auth.login })
}

export function useSignupMutation() {
  return useMutation({ mutationFn: api.auth.signup })
}

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: api.auth.forgotPassword })
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: api.auth.resetPassword })
}
