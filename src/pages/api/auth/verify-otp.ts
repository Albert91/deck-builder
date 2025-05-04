import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '@/db/supabase.client';
import { z } from "zod";

const otpVerifySchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
  token: z.string().min(6, "Kod weryfikacyjny jest wymagany")
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parsowanie i walidacja danych
    const body = await request.json();
    const result = otpVerifySchema.safeParse(body);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Nieprawidłowe dane weryfikacji" 
        }),
        { status: 400 }
      );
    }
    
    const { email, token } = result.data;
    
    // Utworzenie klienta Supabase
    const supabase = createSupabaseServerClient({
      cookies,
      headers: request.headers,
    });
    
    // Weryfikacja OTP
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    
    if (error) {
      console.error('OTP verification error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Konto nie istnieje lub nieprawidłowy kod" 
        }),
        { status: 401 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        user: { id: data?.user?.id } 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error during OTP verification:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Wystąpił nieoczekiwany błąd" 
      }),
      { status: 500 }
    );
  }
}; 