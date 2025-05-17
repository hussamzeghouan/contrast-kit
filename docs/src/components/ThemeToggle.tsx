import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check if darkMode was set in localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    // Check for system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`p-2 rounded-full transition-colors ${
        isDarkMode 
          ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700' 
          : 'bg-gray-200 text-blue-700 hover:bg-gray-300'
      } ${className}`}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
