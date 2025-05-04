import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateDeckCommand, DeckDTO, DeckListResponseDTO, SearchParams, Deck } from '../../types';
import { mapToDeckDTO } from '../../types';

/**
 * Retrieves a list of decks for a specific user.
 * Supports full-text search on deck names.
 */
export async function listDecks(
  supabase: SupabaseClient,
  userId: string,
  params: SearchParams
): Promise<DeckListResponseDTO> {
  const { search } = params;
  
  const query = supabase
    .from('decks')
    .select('id, name, share_hash, created_at, updated_at', { count: 'exact' })
    .eq('owner_id', userId);

  if (search) {
    query.textSearch('name_tsv', search, { config: 'english' });
  }
  
  // Add sorting if specified in params
  if (params.sortBy) {
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
    query.order(params.sortBy, { ascending: sortOrder === 'asc' });
  } else {
    // Default sort by updated_at DESC if not specified
    query.order('updated_at', { ascending: false });
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching decks:', error);
    throw error;
  }

  // Convert the database results to DeckDTO objects
  const items: DeckDTO[] = (data || []).map(deck => ({
    id: deck.id,
    name: deck.name,
    share_hash: deck.share_hash,
    created_at: deck.created_at,
    updated_at: deck.updated_at
  }));

  return {
    items,
    totalCount: count || 0,
    page: 1,
    limit: items.length
  };
}

/**
 * Deletes a deck and its associated cards.
 * Checks if the deck exists and if the user is the owner before deletion.
 * Cascading deletion of cards is handled by database constraints.
 */
export async function deleteDeck(
  supabase: SupabaseClient,
  deckId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  // First check if the deck exists and belongs to the user
  const { data: deck, error: fetchError } = await supabase
    .from('decks')
    .select('id, owner_id')
    .eq('id', deckId)
    .single();

  if (fetchError) {
    return { success: false, error: 'Deck not found' };
  }

  // Check if user is the owner
  if (deck.owner_id !== userId) {
    return { 
      success: false, 
      error: 'User is not the owner of this deck' 
    };
  }

  // Delete the deck (cascade deletion will handle cards)
  const { error: deleteError } = await supabase
    .from('decks')
    .delete()
    .eq('id', deckId);

  if (deleteError) {
    console.error('Error deleting deck:', deleteError);
    throw deleteError;
  }

  return { success: true };
}

/**
 * Gets the count of decks owned by a user.
 * Used to enforce the deck limit per user.
 */
export async function getUserDeckCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from('decks')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId);

  if (error) {
    console.error('Error counting user decks:', error);
    throw error;
  }

  return count || 0;
}

/**
 * Creates a new deck for a user.
 * The share_hash will be generated automatically by a database trigger.
 */
export async function createDeck(
  supabase: SupabaseClient,
  userId: string,
  data: CreateDeckCommand
): Promise<DeckDTO> {
  // Create the new deck
  const { data: deck, error } = await supabase
    .from('decks')
    .insert({
      name: data.name,
      owner_id: userId
    })
    .select('id, name, share_hash, created_at, updated_at')
    .single();

  if (error) {
    console.error('Error creating deck:', error);
    throw error;
  }

  return mapToDeckDTO(deck as Deck);
}

/**
 * Pobiera talię na podstawie ID z weryfikacją właściciela
 */
export async function getDeckById(
  supabase: SupabaseClient,
  userId: string,
  deckId: string
): Promise<DeckDTO> {
  const { data, error } = await supabase
    .from('decks')
    .select('id, name, share_hash, created_at, updated_at, owner_id')
    .eq('id', deckId)
    .single();

  if (error) {
    console.error('Error fetching deck:', error);
    throw error;
  }

  // Sprawdzenie czy użytkownik jest właścicielem talii
  if (data.owner_id !== userId) {
    throw new Error('Brak uprawnień do wyświetlenia tej talii');
  }

  return mapToDeckDTO(data as Deck);
} 