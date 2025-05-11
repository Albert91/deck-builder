import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '@/db/supabase.client';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy format adresu email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parsowanie i walidacja danych
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Nieprawidłowe dane logowania',
        }),
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Utworzenie klienta Supabase
    const supabase = createSupabaseServerClient({
      cookies,
      headers: request.headers,
    });

    // Próba logowania
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
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
        user: { id: data.user.id },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Wystąpił nieoczekiwany błąd',
      }),
      { status: 500 }
    );
  }
};
