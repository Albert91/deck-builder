import { createSupabaseServerClient } from '@/db/supabase.client';
import { forgotPasswordSchema } from '@/lib/validators/auth';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request data
    const { email } = forgotPasswordSchema.parse(body);

    // Initialize Supabase client
    const supabase = createSupabaseServerClient({ headers: request.headers, cookies });

    // Send password reset email
    // @todo adjust the domain url when go to production
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:3000/reset-password`,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          code: 'auth/forgot-password-error',
          message: error.message,
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
        message: 'Password reset link has been sent to your email',
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

    console.error('Forgot password error:', error);
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
