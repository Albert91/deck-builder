import { z } from 'zod';

export const generateImageSchema = z.object({
  prompt: z.string().trim().min(1).max(1000),
  type: z.enum(['front', 'back']),
});

export type GenerateImageSchema = z.infer<typeof generateImageSchema>;
