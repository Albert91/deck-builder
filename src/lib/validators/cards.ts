import { z } from 'zod';

export const listCardsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export type ListCardsSchema = z.infer<typeof listCardsSchema>;

export const createCardSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().optional()
});

export type CreateCardSchema = z.infer<typeof createCardSchema>; 