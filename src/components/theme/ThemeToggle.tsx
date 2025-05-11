'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>('light');

  // Initialize theme on mount
  useEffect(() => {
    const getThemePreference = () => {
      if (typeof localStorage !== 'undefined') {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
          return storedTheme;
        }
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const currentTheme = getThemePreference();
    setTheme(currentTheme);
  }, []);

  // Update theme when state changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;

      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="p-2 rounded-full bg-black hover:bg-amber-400 dark:bg-white dark:hover:bg-amber-400"
      aria-label="Przełącz tryb ciemny"
    >
      <Sun className="h-5 w-5 block dark:hidden text-white" />
      <Moon className="h-5 w-5 hidden dark:block text-gray-800" />
    </Button>
  );
}
