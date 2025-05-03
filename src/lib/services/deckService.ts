import type { SupabaseClient } from '@supabase/supabase-js';
import type { DeckDTO, DeckListResponseDTO, SearchParams } from '../../types';
import { mapToDeckDTO } from '../mappers';

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

  const items: DeckDTO[] = (data || []).map(mapToDeckDTO);

  return {
    items,
    totalCount: count || 0,
    page,
    limit
  };
} 