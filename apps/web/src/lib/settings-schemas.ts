import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createSettingsSchemas(t: TFunction) {
  const changePasswordSchema = z
    .object({
      currentPassword: z.string().min(1, t('validation.currentPasswordRequired')),
      newPassword: z
        .string()
        .min(1, t('validation.newPasswordRequired'))
        .min(8, t('validation.passwordTooShort')),
      confirmPassword: z.string().min(1, t('validation.confirmNewPasswordRequired')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('validation.passwordsMismatch'),
      path: ['confirmPassword'],
    })

  return { changePasswordSchema }
}
