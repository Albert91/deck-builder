import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '@/db/supabase.client';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parsing and validating data
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid login data',
        }),
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Creating Supabase client
    const supabase = createSupabaseServerClient({
      cookies,
      headers: request.headers,
    });

    // Login attempt
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Account does not exist',
        }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: { id: data.user.id },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An unexpected error occurred',
      }),
      { status: 500 }
    );
  }
};
