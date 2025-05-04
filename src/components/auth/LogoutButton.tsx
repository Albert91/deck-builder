import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

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
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="icon"
      className="fixed top-5 right-16 p-2 rounded-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
      aria-label="Wyloguj się"
      disabled={isLoading}
    >
      <LogOut className="h-5 w-5 text-white" />
    </Button>
  );
} 