import { z } from 'zod'

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Item schemas
export const itemStatusEnum = z.enum(['LOST', 'FOUND'])
export const itemCategoryEnum = z.enum([
  'ELECTRONICS',
  'PETS',
  'KEYS',
  'WALLET',
  'DOCUMENTS',
  'APPAREL',
  'JEWELRY',
  'BAGS',
  'SPORTS',
  'OTHER'
])

export const createItemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters').max(100),
  status: itemStatusEnum,
  category: itemCategoryEnum,
  description: z.string().min(20, 'Description must be at least 20 characters').max(500),
  locationText: z.string().min(2, 'Location is required'),
  lat: z.number().optional(),
  lng: z.number().optional(),
  date: z.string().or(z.date()),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
})

export const updateItemSchema = createItemSchema.partial().extend({
  isClosed: z.boolean().optional(),
})

// Message schemas
export const sendMessageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(1000),
  attachmentUrl: z.string().url().optional(),
})

// Profile schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  image: z.string().url().optional(),
})

// Search/filter schemas
export const itemSearchSchema = z.object({
  status: itemStatusEnum.optional(),
  category: itemCategoryEnum.optional(),
  q: z.string().optional(),
  location: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ItemSearchInput = z.infer<typeof itemSearchSchema>
