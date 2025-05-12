import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from '../db/supabase.client';

// Paths that are accessible without login
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/reset-password',
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/request-otp',
  '/api/auth/verify-otp',
  '/api/auth/register',
  '/api/auth/reset-password',
  '/api/auth/forgot-password',
];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  // Creating Supabase client for this request
  const supabase = createSupabaseServerClient({
    cookies,
    headers: request.headers,
  });

  // Adding Supabase client to context
  locals.supabase = supabase;

  // Checking if the path is public
  const isPublicPath = PUBLIC_PATHS.some((path) => url.pathname === path || url.pathname.startsWith('/assets/'));

  // Getting user information
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // If user is logged in, add them to context
    locals.user = {
      id: user.id,
    };
  } else if (!isPublicPath) {
    // If user is not logged in and trying to access a protected route
    return redirect('/login');
  }

  return next();
});
