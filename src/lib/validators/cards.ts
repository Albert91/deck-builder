import { z } from 'zod';

export const listCardsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export type ListCardsSchema = z.infer<typeof listCardsSchema>; 