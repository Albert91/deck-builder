import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '@/db/supabase.client';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createSupabaseServerClient({
      cookies,
      headers: request.headers,
    });
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Wystąpił błąd podczas wylogowywania" 
        }),
        { status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Wylogowano pomyślnie" 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error during logout:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Wystąpił nieoczekiwany błąd" 
      }),
      { status: 500 }
    );
  }
}; 