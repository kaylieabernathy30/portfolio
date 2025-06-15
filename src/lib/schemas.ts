// src/lib/schemas.ts
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100, { message: "Title must be at most 100 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000, { message: "Description must be at most 1000 characters." }),
  tags: z.string()
    .min(1, { message: "At least one tag is required." })
    .regex(/^[a-zA-Z0-9\s,-.]+$/, { message: "Tags can only contain letters, numbers, spaces, commas, hyphens and periods."})
    .transform(val => val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
