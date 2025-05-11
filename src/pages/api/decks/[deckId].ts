import type { APIRoute } from 'astro';
import { deleteDeck } from '../../../lib/services/deckService';
import { uuidSchema } from '../../../lib/validators/common';
import { deckIdSchema } from '../../../lib/validators/decks';
import { getDeckById } from '../../../lib/services/deckService';

export const prerender = false;

export const DELETE: APIRoute = async ({ params, locals }) => {
  // Authentication check
  const {
    data: { user },
    error: authError,
  } = await locals.supabase.auth.getUser();

  if (authError || !user) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized',
        details: 'Authentication required to perform this action',
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Validate deckId parameter
    const deckIdValidation = uuidSchema.safeParse(params.deckId);

    if (!deckIdValidation.success) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          details: 'Invalid deck ID format',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deckId = deckIdValidation.data;
    const userId = user.id;

    // Delete the deck using service
    const result = await deleteDeck(locals.supabase, deckId, userId);

    if (!result.success) {
      if (result.error === 'Deck not found') {
        return new Response(
          JSON.stringify({
            error: 'Not Found',
            details: 'Deck not found',
          }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      } else if (result.error === 'User is not the owner of this deck') {
        return new Response(
          JSON.stringify({
            error: 'Forbidden',
            details: 'User is not the owner of this deck',
          }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Return 204 No Content for successful deletion
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Server error while deleting deck:', error);

    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async ({ params, locals }) => {
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
    // Validate deckId parameter
    const { deckId } = params;
    const validationResult = deckIdSchema.safeParse(deckId);

    if (!validationResult.success) {
      return new Response(JSON.stringify({ error: validationResult.error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get deck by ID
    try {
      const deck = await getDeckById(locals.supabase, user.id, validationResult.data);

      return new Response(JSON.stringify(deck), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
      // Handle specific errors
      if (error.message === 'Talia nie została znaleziona') {
        return new Response(JSON.stringify({ error: 'Talia nie została znaleziona' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (error.message === 'Brak uprawnień do wyświetlenia tej talii') {
        return new Response(JSON.stringify({ error: 'Brak uprawnień do wyświetlenia tej talii' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Re-throw for generic error handling
      throw error;
    }
  } catch (error) {
    console.error('Server error while fetching deck:', error);

    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
