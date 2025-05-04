import type { APIRoute } from 'astro';
import { searchDecksSchema, createDeckSchema } from '../../lib/validators/decks';
import { listDecks, getUserDeckCount, createDeck } from '../../lib/services/deckService';
import { defaultUserId } from '@/db/supabase.client';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  // Authentication check
  // const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
  
  // if (authError || !user) {
  //   return new Response(
  //     JSON.stringify({ error: 'Unauthorized' }),
  //     { status: 401, headers: { 'Content-Type': 'application/json' } }
  //   );
  // }

  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    
    const validationResult = searchDecksSchema.safeParse(searchParams);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: validationResult.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get decks from service
    const params = validationResult.data;
    const result = await listDecks(locals.supabase, defaultUserId, params);
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error while listing decks:', error);
    
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  // Authentication check
  const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
  
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = createDeckSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: validationResult.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const validatedData = validationResult.data;
    
    // Check if user has reached the deck limit (5)
    const deckCount = await getUserDeckCount(locals.supabase, user.id);
    const DECK_LIMIT = 5;
    
    if (deckCount >= DECK_LIMIT) {
      return new Response(
        JSON.stringify({ error: `Deck limit reached (${DECK_LIMIT})` }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create the deck
    try {
      const newDeck = await createDeck(locals.supabase, user.id, validatedData);
      
      return new Response(
        JSON.stringify(newDeck),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error: any) {      
      // Re-throw for generic error handling
      throw error;
    }
  } catch (error) {
    console.error('Server error while creating deck:', error);
    
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 