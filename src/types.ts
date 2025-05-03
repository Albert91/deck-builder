// src/types.ts

import type { Database } from './db/database.types';

// Aliases for database tables for easier access
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

// Individual table row types
export type Template = Tables['templates']['Row'];
export type Deck = Tables['decks']['Row'];
export type Card = Tables['cards']['Row'];
export type CardAttribute = Tables['card_attributes']['Row'];
export type ImageMetadata = Tables['image_metadata']['Row'];

// =================== USER TYPES ===================

export type UserDTO = {
  id: string;
  email: string;
  username: string;
  created_at: string;
};

// =================== TEMPLATE TYPES ===================

export type TemplateDTO = Pick<Template, 'id' | 'name' | 'description'>;
export type TemplateListDTO = TemplateDTO[];

// =================== DECK TYPES ===================

export type DeckDTO = Pick<Deck, 'id' | 'name' | 'share_hash' | 'template_id' | 'created_at' | 'updated_at'>;

export interface CreateDeckCommand {
  name: string;
  template_id: string;
}

export interface UpdateDeckCommand {
  name?: string;
  template_id?: string;
}

export interface DeckListResponseDTO {
  items: DeckDTO[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface SharedDeckDTO extends DeckDTO {
  cards: CardDTO[];
}

// =================== CARD TYPES ===================

export type CardAttributeDTO = Pick<CardAttribute, 'id' | 'attribute_type' | 'value'>;

export type CardDTO = Pick<Card, 'id' | 'title' | 'description' | 'image_metadata_id' | 'created_at' | 'updated_at'> & {
  attributes?: CardAttributeDTO[];
};

export interface CreateCardCommand {
  title: string;
  description: string | null;
}

export interface UpdateCardCommand {
  title?: string;
  description?: string | null;
}

export interface CardListResponseDTO {
  items: CardDTO[];
  totalCount: number;
  page: number;
  limit: number;
}

// =================== IMAGE GENERATION TYPES ===================

export interface GenerateImageCommand {
  prompt: string;
}

export interface GeneratedImageDTO {
  image_metadata_id: string;
  file_path: string;
}

// Use the same types for both deck background and deck back
export type GenerateBackgroundCommand = GenerateImageCommand;
export type GenerateBackgroundDTO = GeneratedImageDTO;
export type GenerateBackCommand = GenerateImageCommand;
export type GenerateBackDTO = GeneratedImageDTO;
export type GenerateCardImageDTO = GeneratedImageDTO;

// =================== ANALYTICS TYPES ===================

export interface DeckAnalyticsDTO {
  totalDecks: number;
}

export interface CardAnalyticsDTO {
  totalCards: number;
}

// =================== PAGINATION TYPES ===================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
}

// Mapping helpers for converting database rows to DTOs
export const mapToCardDTO = (card: Card, attributes?: CardAttribute[]): CardDTO => ({
  id: card.id,
  title: card.title,
  description: card.description,
  image_metadata_id: card.image_metadata_id,
  created_at: card.created_at,
  updated_at: card.updated_at,
  attributes: attributes?.map(attr => ({
    id: attr.id,
    attribute_type: attr.attribute_type,
    value: attr.value
  }))
});

export const mapToDeckDTO = (deck: Deck): DeckDTO => ({
  id: deck.id,
  name: deck.name,
  share_hash: deck.share_hash,
  template_id: deck.template_id,
  created_at: deck.created_at,
  updated_at: deck.updated_at
});