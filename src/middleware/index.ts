import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from '../db/supabase.client';

// Ścieżki, które są dostępne bez logowania
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/request-otp',
  '/api/auth/verify-otp',
  '/api/auth/register',
  '/api/auth/reset-password',
  '/api/auth/forgot-password',
];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, request, redirect }, next) => {
    // Tworzenie klienta Supabase dla tego żądania
    const supabase = createSupabaseServerClient({
      cookies,
      headers: request.headers,
    });
    
    // Dodanie klienta Supabase do kontekstu
    locals.supabase = supabase;

    // Sprawdzenie, czy ścieżka jest publiczna
    const isPublicPath = PUBLIC_PATHS.some(path => 
      url.pathname === path || url.pathname.startsWith('/assets/')
    );

    // Pobieranie informacji o użytkowniku
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Jeśli użytkownik jest zalogowany, dodaj go do kontekstu
      locals.user = {
        id: user.id,
      };
    } else if (!isPublicPath) {
      // Jeśli użytkownik nie jest zalogowany i próbuje uzyskać dostęp do chronionej trasy
      return redirect('/login');
    }

    return next();
  }
); 