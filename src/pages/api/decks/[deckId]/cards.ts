import type { APIRoute } from 'astro';
import { listCardsSchema } from '../../../../lib/validators/cards';
import { deckIdSchema } from '../../../../lib/validators/decks';
import { listCards } from '../../../../lib/services/cardService';

export const prerender = false;

export const GET: APIRoute = async ({ params, request, locals }) => {
  // Authentication check
  const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
  
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Validate deckId parameter
    const deckIdValidation = deckIdSchema.safeParse(params.deckId);
    
    if (!deckIdValidation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid deck ID format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate query parameters (page, limit)
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    
    const validationResult = listCardsSchema.safeParse(searchParams);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: validationResult.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get cards from service
    try {
      const deckId = deckIdValidation.data;
      const queryParams = validationResult.data;
      const result = await listCards(locals.supabase, user.id, deckId, queryParams);
      
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error: any) {
      // Handle specific errors
      if (error.message === 'Deck not found') {
        return new Response(
          JSON.stringify({ error: 'Deck not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (error.message === 'User is not the owner of this deck') {
        return new Response(
          JSON.stringify({ error: 'Forbidden: User is not the owner of this deck' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Re-throw for generic error handling
      throw error;
    }
  } catch (error) {
    console.error('Server error while listing cards:', error);
    
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 