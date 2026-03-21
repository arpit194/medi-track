import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createAuthSchemas(t: TFunction) {
  const nameSchema = z.string().min(1, t('validation.nameRequired'))

  const emailSchema = z
    .string()
    .min(1, t('validation.emailRequired'))
    .refine(
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      t('validation.emailInvalid'),
    )

  const passwordSchema = z
    .string()
    .min(1, t('validation.passwordRequired'))
    .min(8, t('validation.passwordTooShort'))

  const resetPasswordSchema = z
    .object({
      password: passwordSchema,
      confirmPassword: z.string().min(1, t('validation.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordsMismatch'),
      path: ['confirmPassword'],
    })

  const forgotPasswordSchema = z.object({
    email: emailSchema,
  })

  const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  })

  const signupSchema = z
    .object({
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: z.string().min(1, t('validation.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordsMismatch'),
      path: ['confirmPassword'],
    })

  return { nameSchema, emailSchema, passwordSchema, resetPasswordSchema, forgotPasswordSchema, loginSchema, signupSchema }
}
