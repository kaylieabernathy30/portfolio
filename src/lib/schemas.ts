// src/lib/schemas.ts
import { z } from 'zod';

// Schema for form input processing
export const projectFormInputSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100, { message: "Title must be at most 100 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000, { message: "Description must be at most 1000 characters." }),
  tags: z.string() 
    .min(1, { message: "At least one tag is required." })
    .regex(/^[a-zA-Z0-9\s,-.]+$/, { message: "Tags can only contain letters, numbers, spaces, commas, hyphens and periods."})
    .transform(val => val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)),
  imageUrls: z.string()
    .default("") 
    .transform((str) => {
      if (!str || str.trim() === "") return [];
      return str.split(',').map(url => url.trim()).filter(url => url !== "");
    })
    .pipe(z.array(z.string().url({ message: "One or more image URLs are invalid. Please use comma-separated valid URLs." }))),
  liveDemoUrl: z.string().url({ message: "Please enter a valid URL for the live demo." }).optional().or(z.literal('')),
  sourceCodeUrl: z.string().url({ message: "Please enter a valid URL for the source code." }).optional().or(z.literal('')),
});

export type ProjectFormData = z.infer<typeof projectFormInputSchema>;

// Schema for validating the payload received by server actions.
export const projectServerValidationSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  tags: z.array(z.string().min(1)).min(1),
  imageUrls: z.array(z.string().url({ message: "Each image URL must be valid." })),
  liveDemoUrl: z.string().url().optional().or(z.literal('')),
  sourceCodeUrl: z.string().url().optional().or(z.literal('')),
});


export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], 
});

export type SignupFormData = z.infer<typeof signupSchema>;
