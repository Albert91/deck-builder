import type { APIRoute } from 'astro';
import { generateImageSchema } from '../../../lib/validators/images';
import { ImageService } from '../../../lib/services/imageService';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized. You must be signed in.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse request body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate request data
  const validationResult = generateImageSchema.safeParse(body);
  if (!validationResult.success) {
    return new Response(
      JSON.stringify({
        error: 'Validation error',
        details: validationResult.error.format(),
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Get validated data
  const { prompt, type } = validationResult.data;

  try {
    // Check for OpenAI API key in environment variables
    const openaiApiKey = import.meta.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create image service and generate image
    const imageService = new ImageService(openaiApiKey);
    const result = await imageService.generateImage({ prompt, type });

    // Return success response with image generation result
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error generating image:', error);

    // Return error response
    return new Response(
      JSON.stringify({
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
