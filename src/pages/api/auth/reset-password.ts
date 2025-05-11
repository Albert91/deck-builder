import { createSupabaseServerClient } from '@/db/supabase.client';
import { resetPasswordSchema } from '@/lib/validators/auth';
import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request data
    const { password, token } = resetPasswordSchema.parse(body);

    // Initialize Supabase client
    const supabase = createSupabaseServerClient({ headers: request.headers, cookies });

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(token);
    // Update user's password
    const { error } = await supabase.auth.updateUser(
      {
        password,
      },
      {
        emailRedirectTo: `${import.meta.env.SITE}/login`,
      }
    );

    if (error || exchangeError) {
      return new Response(
        JSON.stringify({
          code: 'auth/reset-password-error',
          message: error?.message || exchangeError?.message,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password has been successfully reset',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    if (error.errors) {
      return new Response(
        JSON.stringify({
          code: 'validation/invalid-input',
          message: error.errors[0].message,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.error('Password reset error:', error);
    return new Response(
      JSON.stringify({
        code: 'server/internal-error',
        message: 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
