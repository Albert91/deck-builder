import type { APIContext } from 'astro';
import { deckIdSchema } from '../../../../../../lib/validators/decks';
import { cardIdSchema } from '../../../../../../lib/validators/cards';
import { deleteCard } from '../../../../../../lib/services/cardService';

export async function DELETE({ params, locals }: APIContext) {
  try {
    const supabase = locals.supabase;
    const user = locals.user;

    // Ensure user is authenticated
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'You must be logged in to delete a card' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate parameters
    const deckIdResult = deckIdSchema.safeParse(params.deckId);
    if (!deckIdResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid deck ID format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cardIdResult = cardIdSchema.safeParse(params.cardId);
    if (!cardIdResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid card ID format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Attempt to delete the card
    try {
      await deleteCard(
        supabase,
        user.id,
        deckIdResult.data,
        cardIdResult.data
      );

      // Return success with 204 No Content
      return new Response(null, { status: 204 });

    } catch (error) {
      console.error('Error deleting card:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message === 'Deck not found') {
          return new Response(
            JSON.stringify({ error: 'Deck not found' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        } else if (error.message === 'User is not the owner of this deck') {
          return new Response(
            JSON.stringify({ error: 'You do not have permission to delete cards from this deck' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        } else if (error.message === 'Card not found or does not belong to this deck') {
          return new Response(
            JSON.stringify({ error: 'Card not found or does not belong to this deck' }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      // Generic server error for unhandled cases
      return new Response(
        JSON.stringify({ error: 'An unexpected error occurred while deleting the card' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Unexpected error in card deletion endpoint:', error);
    
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 