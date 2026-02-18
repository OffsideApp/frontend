// app/(auth)/auth.schema.ts
import { z } from 'zod';

// 1. Signup Rules
export const signupSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 2. Login Rules
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Export the "Types" automatically generated from the rules
export type SignupFormType = z.infer<typeof signupSchema>;
export type LoginFormType = z.infer<typeof loginSchema>;