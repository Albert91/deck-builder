import type { SupabaseClient } from '@supabase/supabase-js';
import type { DeckDTO, DeckListResponseDTO, SearchParams } from '../../types';

/**
 * Retrieves a paginated list of decks for a specific user.
 * Supports full-text search on deck names.
 */
export async function listDecks(
  supabase: SupabaseClient,
  userId: string,
  params: SearchParams
): Promise<DeckListResponseDTO> {
  const { page = 1, limit = 20, search } = params;
  
  const query = supabase
    .from('decks')
    .select('id, name, share_hash, template_id, created_at, updated_at', { count: 'exact' })
    .eq('owner_id', userId);

  if (search) {
    query.textSearch('name_tsv', search, { config: 'english' });
  }

  const from = (page - 1) * limit;
  const to = page * limit - 1;
  
  query.range(from, to);
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
    template_id: deck.template_id,
    created_at: deck.created_at,
    updated_at: deck.updated_at
  }));

  return {
    items,
    totalCount: count || 0,
    page,
    limit
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