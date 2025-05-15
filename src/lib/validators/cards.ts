import { z } from 'zod';

export const listCardsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ListCardsSchema = z.infer<typeof listCardsSchema>;

const attributeSchema = z.object({
  attribute_type: z.enum(['strength', 'defense', 'health']),
  value: z.number().int().min(0).max(99),
});

const imageDataSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
  model: z.string(),
  parameters: z.record(z.unknown()),
});

export const createCardSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().optional(),
  attributes: z.array(attributeSchema).optional(),
  image_data: imageDataSchema.optional(),
});

export type CreateCardSchema = z.infer<typeof createCardSchema>;

export const updateCardSchema = z
  .object({
    title: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(500).nullable().optional(),
    attributes: z.array(attributeSchema).optional(),
    image_data: imageDataSchema.optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.attributes !== undefined ||
      data.image_data !== undefined,
    {
      message: 'You must provide a title, description, attributes, or image data to update',
    }
  );

export type UpdateCardSchema = z.infer<typeof updateCardSchema>;

export const cardIdSchema = z.string().uuid('Card ID must be a valid UUID');
export type CardIdSchema = z.infer<typeof cardIdSchema>;
