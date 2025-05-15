import type { APIRoute } from 'astro';
import { getUserDeckCount } from '../../../lib/services/deckService';

export const GET: APIRoute = async ({ locals }) => {
  // Authentication check
  const {
    data: { user },
    error: authError,
  } = await locals.supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get user's deck count
    const totalDecks = await getUserDeckCount(locals.supabase, user.id);
    const DECK_LIMIT = 5;

    return new Response(
      JSON.stringify({
        totalDecks,
        deckLimit: DECK_LIMIT,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Server error while getting deck count:', error);

    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}; 