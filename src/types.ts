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

export type UserDTO = {
  id: string;
  email: string;
  username: string;
  created_at: string;
};

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

// Model widoku dla pojedynczej talii
export interface DeckViewModel extends DeckDTO {
  cardCount: number;       // liczba kart w talii
  thumbnailUrl: string;    // URL miniatury talii
}

// Parametry listy talii (rozszerzenie SearchParams)
export interface DeckListParams extends SearchParams {
  sortBy?: string;          // pole po którym sortujemy
  sortOrder?: 'asc' | 'desc'; // kierunek sortowania
}

// Model paginacji
export interface PaginationModel {
  currentPage: number;     // aktualna strona
  totalPages: number;      // całkowita liczba stron
  totalItems: number;      // całkowita liczba elementów
  itemsPerPage: number;    // liczba elementów na stronę
}

// Opcje sortowania talii
export interface DeckSortOption {
  id: string;              // identyfikator opcji
  label: string;           // etykieta wyświetlana użytkownikowi
  value: string;           // wartość używana w API
}

// Stan filtrów
export interface DeckFilterState {
  search: string;          // tekst wyszukiwania
  sortBy: string;          // pole sortowania
  sortOrder: 'asc' | 'desc'; // kierunek sortowania
}

// Informacje o limicie talii
export interface DeckLimitInfo {
  totalDecks: number;      // aktualna liczba talii
  deckLimit: number;       // maksymalna liczba talii (5)
}

// =================== CARD LIST VIEW TYPES ===================

// Model widoku dla pojedynczej karty
export interface CardViewModel extends CardDTO {
  thumbnailUrl: string;       // URL miniatury karty (awers)
  backThumbnailUrl: string;   // URL miniatury karty (rewers)
}

// Parametry listy kart (rozszerzenie PaginationParams)
export interface CardListParams extends PaginationParams {
  viewMode?: 'front' | 'back'; // tryb wyświetlania (awers/rewers)
}

// Stan filtrów widoku kart
export interface CardFilterState {
  page: number;              // aktualna strona
  limit: number;             // liczba kart na stronę
}

// Informacje o limicie kart
export interface CardLimitInfo {
  totalCards: number;       // aktualna liczba kart
  cardLimit: number;        // maksymalna liczba kart (100)
}

// Stan operacji eksportu
export interface ExportStatus {
  isExporting: boolean;    // czy eksport jest w trakcie
  progress?: number;       // opcjonalny postęp eksportu (0-100)
  error?: string;          // opcjonalny błąd eksportu
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
  created_at: deck.created_at,
  updated_at: deck.updated_at,
  image_metadata_id: deck.image_metadata_id
});