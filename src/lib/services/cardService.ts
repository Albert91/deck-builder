import type { SupabaseClient } from '@supabase/supabase-js';
import type { CardDTO, CardListResponseDTO, PaginationParams, Card, CreateCardCommand } from '../../types';
import { mapToCardDTO } from '../../types';

/**
 * Retrieves a list of cards for a specific deck.
 * Supports pagination with page and limit parameters.
 */
export async function listCards(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  params: PaginationParams
): Promise<CardListResponseDTO> {
  // First check if the deck exists and belongs to the user
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, owner_id')
    .eq('id', deckId)
    .single();

  if (deckError) {
    if (deckError.code === 'PGRST116') {
      throw new Error('Deck not found');
    }
    throw deckError;
  }

  // Check if user is the owner
  if (deck.owner_id !== userId) {
    throw new Error('User is not the owner of this deck');
  }

  // Set default pagination values if not provided
  const page = params.page || 1;
  const limit = params.limit || 20;
  const offset = (page - 1) * limit;

  // Get cards with pagination
  const { data: cards, count, error } = await supabase
    .from('cards')
    .select('*', { count: 'exact' })
    .eq('deck_id', deckId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }

  // Convert database results to DTOs
  const items: CardDTO[] = (cards || []).map(card => mapToCardDTO(card as Card));

  return {
    items,
    totalCount: count || 0,
    page,
    limit
  };
}

/**
 * Gets the count of cards in a specific deck.
 * Used to validate that the card limit (100) is not exceeded.
 */
export async function getCardCount(
  supabase: SupabaseClient,
  deckId: string
): Promise<number> {
  const { count, error } = await supabase
    .from('cards')
    .select('id', { count: 'exact', head: true })
    .eq('deck_id', deckId);

  if (error) {
    console.error('Error getting card count:', error);
    throw error;
  }

  return count || 0;
}

/**
 * Creates a new card in the specified deck.
 * Returns the created card as a CardDTO.
 */
export async function createCard(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  cardData: CreateCardCommand
): Promise<CardDTO> {
  // First check if the deck exists and belongs to the user
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, owner_id')
    .eq('id', deckId)
    .single();

  if (deckError) {
    if (deckError.code === 'PGRST116') {
      throw new Error('Deck not found');
    }
    throw deckError;
  }

  // Check if user is the owner
  if (deck.owner_id !== userId) {
    throw new Error('User is not the owner of this deck');
  }

  // Check card limit
  const cardCount = await getCardCount(supabase, deckId);
  if (cardCount >= 100) {
    throw new Error('Card limit reached (100)');
  }

  // Insert the new card
  const { data: card, error } = await supabase
    .from('cards')
    .insert({
      deck_id: deckId,
      title: cardData.title,
      description: cardData.description || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating card:', error);
    throw error;
  }

  return mapToCardDTO(card as Card);
}

/**
 * Deletes a card from the specified deck.
 * Verifies that the card exists, is part of the specified deck, 
 * and the user is the owner of the deck.
 */
export async function deleteCard(
  supabase: SupabaseClient, 
  userId: string,
  deckId: string,
  cardId: string
): Promise<void> {
  // First check if the deck exists and belongs to the user
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, owner_id')
    .eq('id', deckId)
    .single();

  if (deckError) {
    if (deckError.code === 'PGRST116') {
      throw new Error('Deck not found');
    }
    throw deckError;
  }

  // Check if user is the owner
  if (deck.owner_id !== userId) {
    throw new Error('User is not the owner of this deck');
  }

  // Check if the card exists and belongs to the specified deck
  const { data: card, error: cardError } = await supabase
    .from('cards')
    .select('id')
    .eq('id', cardId)
    .eq('deck_id', deckId)
    .single();

  if (cardError) {
    if (cardError.code === 'PGRST116') {
      throw new Error('Card not found or does not belong to this deck');
    }
    throw cardError;
  }

  // Delete the card (card_attributes will be deleted via cascade)
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
    .eq('deck_id', deckId);

  if (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
} 