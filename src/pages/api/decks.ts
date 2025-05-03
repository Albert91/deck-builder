import type { APIRoute } from 'astro';
import { searchDecksSchema } from '../../lib/validation/decks';
import { listDecks } from '../../lib/services/deckService';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  // Authentication check
  const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
  
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

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
    const result = await listDecks(locals.supabase, user.id, params);
    
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