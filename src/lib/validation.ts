import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  type: z.enum(['CLIENT', 'PROVIDER'])
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  category: z.string(),
  basePrice: z.number().positive()
})

export const bookingSchema = z.object({
  providerId: z.string().optional(),
  serviceId: z.string(),
  scheduledAt: z.string().datetime(),
  notes: z.string().optional()
})

export const reviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
})