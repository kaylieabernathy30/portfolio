// src/lib/schemas.ts
import { z } from 'zod';

// Schema for form input processing (takes string for tags, transforms to string[])
// Used by ZodResolver in the ProjectFormDialog
export const projectFormInputSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100, { message: "Title must be at most 100 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000, { message: "Description must be at most 1000 characters." }),
  tags: z.string() // Input from form field is a string
    .min(1, { message: "At least one tag is required." })
    .regex(/^[a-zA-Z0-9\s,-.]+$/, { message: "Tags can only contain letters, numbers, spaces, commas, hyphens and periods."})
    .transform(val => val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)), // Transforms to string[]
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
});

// Type for the data structure after form processing by projectFormInputSchema (tags will be string[])
// This is what react-hook-form's useForm will manage and what the server action will receive.
export type ProjectFormData = z.infer<typeof projectFormInputSchema>;

// Schema for validating the payload received by server actions.
// This schema expects the data to already be in the final 'ProjectFormData' shape.
export const projectServerValidationSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100, { message: "Title must be at most 100 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000, { message: "Description must be at most 1000 characters." }),
  tags: z.array(z.string().min(1, {message: "Individual tags cannot be empty."})) // Expects tags as string[]
          .min(1, { message: "At least one tag is required." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
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
  path: ["confirmPassword"], // path of error
});

export type SignupFormData = z.infer<typeof signupSchema>;
