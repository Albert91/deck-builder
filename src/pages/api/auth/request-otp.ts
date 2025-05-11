import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '@/db/supabase.client';
import { z } from 'zod';

const otpRequestSchema = z.object({
  email: z.string().email('Nieprawidłowy format adresu email'),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parsowanie i walidacja danych
    const body = await request.json();
    const result = otpRequestSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Nieprawidłowy adres email',
        }),
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Utworzenie klienta Supabase
    const supabase = createSupabaseServerClient({
      cookies,
      headers: request.headers,
    });

    // Wysłanie OTP
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      console.error('OTP request error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Konto nie istnieje',
        }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Kod weryfikacyjny został wysłany na podany adres email',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error during OTP request:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Wystąpił nieoczekiwany błąd',
      }),
      { status: 500 }
    );
  }
};
