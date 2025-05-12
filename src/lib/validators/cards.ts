import { z } from 'zod';

export const listCardsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ListCardsSchema = z.infer<typeof listCardsSchema>;

export const createCardSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().optional(),
});

export type CreateCardSchema = z.infer<typeof createCardSchema>;

export const updateCardSchema = z
  .object({
    title: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(500).nullable().optional(),
  })
  .refine((data) => data.title !== undefined || data.description !== undefined, {
    message: 'You must provide a title or description for the card',
  });

export type UpdateCardSchema = z.infer<typeof updateCardSchema>;

export const cardIdSchema = z.string().uuid('Card ID must be a valid UUID');
export type CardIdSchema = z.infer<typeof cardIdSchema>;
