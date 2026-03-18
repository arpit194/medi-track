import { z } from 'zod'

export const nameSchema = z.string().min(1, 'Please enter your full name.')

export const emailSchema = z
  .string()
  .min(1, 'Please enter your email address.')
  .refine(
    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    'Please enter a valid email address, like name@example.com.',
  )

export const passwordSchema = z
  .string()
  .min(1, 'Please enter your password.')
  .min(8, 'Your password must be at least 8 characters.')

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please try again.',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please try again.',
    path: ['confirmPassword'],
  })
