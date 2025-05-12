import { z } from 'zod';

export const searchDecksSchema = z.object({
  search: z.string().trim().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type SearchDecksSchema = z.infer<typeof searchDecksSchema>;

export const createDeckSchema = z.object({
  name: z.string().trim().min(3).max(50),
});

export type CreateDeckSchema = z.infer<typeof createDeckSchema>;

export const deckIdSchema = z.string().uuid('Deck ID must be a valid UUID');
export type DeckIdSchema = z.infer<typeof deckIdSchema>;
