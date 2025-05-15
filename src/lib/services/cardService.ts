import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  CardDTO,
  CardListResponseDTO,
  PaginationParams,
  Card,
  CreateCardCommand,
  UpdateCardCommand,
  CardAttribute,
  ImageMetadata,
} from '../../types';
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
  const {
    data: cards,
    count,
    error,
  } = await supabase
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
  const items: CardDTO[] = (cards || []).map((card) => mapToCardDTO(card as Card));

  return {
    items,
    totalCount: count || 0,
    page,
    limit,
  };
}

/**
 * Gets the count of cards in a specific deck.
 * Used to validate that the card limit (100) is not exceeded.
 */
export async function getCardCount(supabase: SupabaseClient, deckId: string): Promise<number> {
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
 * Creates a new card in a deck.
 * Also creates any associated card attributes and image metadata.
 */
export async function createCard(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  data: CreateCardCommand
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

  // Create the card
  const { data: card, error: cardError } = await supabase
    .from('cards')
    .insert({
      title: data.title,
      description: data.description,
      deck_id: deckId,
    })
    .select()
    .single();

  if (cardError) {
    console.error('Error creating card:', cardError);
    throw cardError;
  }

  // Create card attributes if provided
  if (data.attributes && data.attributes.length > 0) {
    const cardAttributes = data.attributes.map((attr) => ({
      card_id: card.id,
      attribute_type: attr.attribute_type,
      value: attr.value,
    }));

    const { error: attributesError } = await supabase.from('card_attributes').insert(cardAttributes);

    if (attributesError) {
      console.error('Error creating card attributes:', attributesError);
      throw attributesError;
    }
  }

  // Create image metadata if provided
  let imageMetadataId: string | null = null;
  if (data.image_data) {
    const { data: imageMetadata, error: metadataError } = await supabase
      .from('image_metadata')
      .insert({
        entity_id: card.id,
        entity_type: 'card_image',
        file_path: data.image_data.url,
        model: data.image_data.model,
        parameters: data.image_data.parameters,
        prompt: data.image_data.prompt,
        user_id: userId,
      })
      .select()
      .single();

    if (metadataError) {
      console.error('Error creating image metadata:', metadataError);
      throw new Error('Failed to save image metadata');
    }

    imageMetadataId = imageMetadata.id;
  }

  return {
    ...card,
    image_metadata_id: imageMetadataId,
  };
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
  const { error: cardError } = await supabase
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
  const { error } = await supabase.from('cards').delete().eq('id', cardId).eq('deck_id', deckId);

  if (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
}

/**
 * Updates an existing card.
 * Also updates associated card attributes and image metadata.
 */
export async function updateCard(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  cardId: string,
  data: UpdateCardCommand
): Promise<void> {
  // 1. Check if the card exists and belongs to the user's deck
  const { data: existingCard, error: cardError } = await supabase
    .from('cards')
    .select('deck:decks(owner_id)')
    .eq('id', cardId)
    .eq('deck_id', deckId)
    .single();

  if (cardError) {
    if (cardError.code === 'PGRST116') {
      throw new Error('Card not found');
    }
    throw cardError;
  }

  // @ts-expect-error deck type is correct
  if (existingCard.deck.owner_id !== userId) {
    throw new Error('User is not the owner of this deck');
  }

  // 2. Create new image metadata if provided
  let imageMetadataId: string | null = null;
  if (data.image_data) {
    const { data: imageMetadata, error: metadataError } = await supabase
      .from('image_metadata')
      .insert({
        entity_type: 'card_image',
        file_path: data.image_data.url,
        model: data.image_data.model,
        parameters: data.image_data.parameters,
        prompt: data.image_data.prompt,
        user_id: userId,
        entity_id: cardId, // We can set this right away for updates
      })
      .select()
      .single();

    if (metadataError) {
      console.error('Error creating image metadata:', metadataError);
      throw new Error('Failed to save image metadata');
    }

    imageMetadataId = imageMetadata.id;
  }

  // 3. Update the card
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (imageMetadataId !== null) updateData.image_metadata_id = imageMetadataId;
  updateData.updated_at = new Date().toISOString();

  const { error: updateError } = await supabase.from('cards').update(updateData).eq('id', cardId);

  if (updateError) {
    console.error('Error updating card:', updateError);
    throw updateError;
  }

  // 4. Update card attributes if provided
  if (data.attributes && data.attributes.length > 0) {
    // First delete existing attributes
    const { error: deleteError } = await supabase.from('card_attributes').delete().eq('card_id', cardId);

    if (deleteError) {
      console.error('Error deleting existing card attributes:', deleteError);
      throw deleteError;
    }

    // Then insert new attributes
    const cardAttributes = data.attributes.map((attr) => ({
      card_id: cardId,
      attribute_type: attr.attribute_type,
      value: attr.value,
    }));

    const { error: attributesError } = await supabase.from('card_attributes').insert(cardAttributes);

    if (attributesError) {
      console.error('Error creating card attributes:', attributesError);
      throw attributesError;
    }
  }
}

/**
 * Retrieves a single card by ID.
 * Verifies that the card exists, is part of the specified deck,
 * and the user is the owner of the deck.
 * Returns the card with its attributes and image metadata.
 */
export async function getCard(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  cardId: string
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

  // Get the card and check if it belongs to the specified deck
  const { data: card, error: cardError } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .eq('deck_id', deckId)
    .single();

  if (cardError) {
    if (cardError.code === 'PGRST116') {
      throw new Error('Card not found in this deck');
    }
    throw cardError;
  }

  // Get the card attributes
  const { data: attributes, error: attrError } = await supabase
    .from('card_attributes')
    .select('*')
    .eq('card_id', cardId);

  if (attrError) {
    console.error('Error fetching card attributes:', attrError);
    throw attrError;
  }

  // Get image metadata if it exists
  let imageData = undefined;
  const { data: metadata } = await supabase.from('image_metadata').select('*').eq('entity_id', cardId).single();

  if (metadata) {
    imageData = {
      url: metadata.file_path,
      prompt: metadata.prompt,
      model: metadata.model,
      parameters: metadata.parameters,
    };
  }

  return {
    ...mapToCardDTO(card as Card, attributes as CardAttribute[]),
    image_data: imageData,
  };
}
