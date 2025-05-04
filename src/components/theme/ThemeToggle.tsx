'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

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
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="fixed top-5 right-5 p-2 rounded-full bg-black hover:bg-amber-400 dark:bg-white dark:hover:bg-amber-400"
      aria-label="Toggle dark mode"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 block dark:hidden text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 hidden dark:block text-gray-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </Button>
  );
} 