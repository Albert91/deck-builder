// src/types.ts

import type { Database } from './db/database.types';

// Aliases for database tables for easier access
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

// Individual table row types
export type Deck = Tables['decks']['Row'];
export type Card = Tables['cards']['Row'];
export type CardAttribute = Tables['card_attributes']['Row'];
export type ImageMetadata = Tables['image_metadata']['Row'];

// =================== USER TYPES ===================

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

// =================== DECK TYPES ===================

export type DeckDTO = Pick<Deck, 'id' | 'name' | 'share_hash' | 'created_at' | 'updated_at' | 'image_metadata_id'>;

export interface CreateDeckCommand {
  name: string;
}

export interface UpdateDeckCommand {
  name?: string;
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

// =================== DECK FORM TYPES ===================

export interface DeckFormData {
  name: string;
  frontImage?: string;
  backImage?: string;
}

export interface Toast {
  type: 'success' | 'error';
  message: string;
  id: string;
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

export interface SearchParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// =================== DECK LIST VIEW TYPES ===================

// View model for a single deck
export interface DeckViewModel extends DeckDTO {
  cardCount: number; // number of cards in the deck
  thumbnailUrl: string; // URL of the deck thumbnail
}

// Deck list parameters (extension of SearchParams)
export interface DeckListParams extends SearchParams {
  sortBy?: string; // field to sort by
  sortOrder?: 'asc' | 'desc'; // sort direction
}

// Pagination model
export interface PaginationModel {
  currentPage: number; // current page
  totalPages: number; // total number of pages
  totalItems: number; // total number of items
  itemsPerPage: number; // number of items per page
}

// Deck sorting options
export interface DeckSortOption {
  id: string; // option identifier
  label: string; // label displayed to the user
  value: string; // value used in API
}

// Filter state
export interface DeckFilterState {
  search: string; // search text
  sortBy: string; // sort field
  sortOrder: 'asc' | 'desc'; // sort direction
}

// Deck limit information
export interface DeckLimitInfo {
  totalDecks: number; // current number of decks
  deckLimit: number; // maximum number of decks (5)
}

// =================== CARD LIST VIEW TYPES ===================

// View model for a single card
export interface CardViewModel extends CardDTO {
  thumbnailUrl: string; // URL of the card thumbnail (front)
  backThumbnailUrl: string; // URL of the card thumbnail (back)
}

// Card list parameters (extension of PaginationParams)
export interface CardListParams extends PaginationParams {
  viewMode?: 'front' | 'back'; // display mode (front/back)
}

// Card view filter state
export interface CardFilterState {
  page: number; // current page
  limit: number; // number of cards per page
}

// Card limit information
export interface CardLimitInfo {
  totalCards: number; // current number of cards
  cardLimit: number; // maximum number of cards (100)
}

// Export operation state
export interface ExportStatus {
  isExporting: boolean; // whether export is in progress
  progress?: number; // optional export progress (0-100)
  error?: string; // optional export error
}

// Mapping helpers for converting database rows to DTOs
export const mapToCardDTO = (card: Card, attributes?: CardAttribute[]): CardDTO => ({
  id: card.id,
  title: card.title,
  description: card.description,
  image_metadata_id: card.image_metadata_id,
  created_at: card.created_at,
  updated_at: card.updated_at,
  attributes: attributes?.map((attr) => ({
    id: attr.id,
    attribute_type: attr.attribute_type,
    value: attr.value,
  })),
});

export const mapToDeckDTO = (deck: Deck): DeckDTO => ({
  id: deck.id,
  name: deck.name,
  share_hash: deck.share_hash,
  created_at: deck.created_at,
  updated_at: deck.updated_at,
  image_metadata_id: deck.image_metadata_id,
});
