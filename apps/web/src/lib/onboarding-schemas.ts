import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createOnboardingSchemas(t: TFunction) {
  const onboardingProfileSchema = z.object({
    dob: z.string().min(1, t('validation.dobRequired')),
    bloodType: z.string().min(1, t('validation.bloodTypeRequired')),
    gender: z.string().min(1, t('validation.genderRequired')),
  })

  const profileSchema = z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    dob: z.string().min(1, t('validation.dobRequired')),
    bloodType: z.string().min(1, t('validation.bloodTypeRequired')),
    gender: z.string().min(1, t('validation.genderRequired')),
  })

  return { onboardingProfileSchema, profileSchema }
}
