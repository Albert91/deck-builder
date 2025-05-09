import type { APIRoute } from 'astro';
import { listCardsSchema, createCardSchema } from '../../../../lib/validators/cards';
import { deckIdSchema } from '../../../../lib/validators/decks';
import { listCards, createCard } from '../../../../lib/services/cardService';
import type { CreateCardCommand } from '../../../../types';

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

export const POST: APIRoute = async ({ params, request, locals }) => {
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

    // Parse request body and validate
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validationResult = createCardSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: validationResult.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create card using service
    try {
      const deckId = deckIdValidation.data;
      const validatedData = validationResult.data;
      
      // Convert the Zod schema result to the required CreateCardCommand type
      const cardData: CreateCardCommand = {
        title: validatedData.title,
        description: validatedData.description ?? null
      };
      
      const result = await createCard(locals.supabase, user.id, deckId, cardData);
      
      return new Response(
        JSON.stringify(result),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
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
          JSON.stringify({ error: 'Forbidden: User is not the owner' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (error.message === 'Card limit reached (100)') {
        return new Response(
          JSON.stringify({ error: 'Card limit reached (100)' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Re-throw for generic error handling
      throw error;
    }
  } catch (error) {
    console.error('Server error while creating card:', error);
    
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 