import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['TENANT', 'LANDLORD'], { message: 'Select a role' }),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const createPropertySchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  location: z.string().min(2, 'Location is required'),
  categoryId: z.string().min(1, 'Select a category'),
  images: z.string().min(1, 'Add at least one image URL'),
  amenities: z.string().min(1, 'List at least one amenity (comma separated)'),
});
export type CreatePropertyFormValues = z.infer<typeof createPropertySchema>;