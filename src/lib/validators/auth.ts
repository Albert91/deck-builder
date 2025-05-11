import { z } from 'zod';

// Schema for login with email and password
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Schema for user registration
export const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  });

// Schema for requesting OTP code
export const otpRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Schema for verifying OTP code
export const otpVerifySchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  code: z.string().min(6, 'Please enter the verification code'),
});

// Schema for requesting password reset
export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Schema for resetting password with token
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  });
