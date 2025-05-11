import type { Deck, DeckDTO } from '../types';

export const mapToDeckDTO = (deck: Deck): DeckDTO => ({
  id: deck.id,
  name: deck.name,
  share_hash: deck.share_hash,
  created_at: deck.created_at,
  updated_at: deck.updated_at,
});
