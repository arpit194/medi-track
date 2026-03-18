import { z } from 'zod'

export const onboardingProfileSchema = z.object({
  dob: z.string().min(1, 'Please enter your date of birth.'),
  bloodType: z.string().min(1, 'Please select your blood type.'),
  gender: z.string().min(1, 'Please select your gender.'),
})
