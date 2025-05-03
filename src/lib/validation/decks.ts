import { z } from 'zod';

export const searchDecksSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().trim().optional()
});

export type SearchDecksSchema = z.infer<typeof searchDecksSchema>; 