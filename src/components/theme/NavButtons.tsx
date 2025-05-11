import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

export default function NavButtons() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthPage, setIsAuthPage] = useState(false);

  // Check if current page is auth-related
  useEffect(() => {
    const pathname = window.location.pathname;
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];

    // Check if the current path starts with any of the auth pages
    const isAuth = authPages.some((page) => pathname === page || pathname.startsWith(`${page}/`));

    setIsAuthPage(isAuth);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-5 right-5 flex gap-2">
      {!isAuthPage && (
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          aria-label="Wyloguj się"
          disabled={isLoading}
        >
          <LogOut className="h-5 w-5 text-white" />
        </Button>
      )}
      <ThemeToggle />
    </div>
  );
}
