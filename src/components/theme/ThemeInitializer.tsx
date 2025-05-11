import { useEffect } from 'react';

export default function ThemeInitializer() {
  useEffect(() => {
    const theme =
      localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // This component doesn't render anything
  return null;
}
