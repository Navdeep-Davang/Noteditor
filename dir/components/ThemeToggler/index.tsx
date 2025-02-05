'use client'

import { Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTheme } from "next-themes";

export const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <div className="flex justify-end mb-4">
      {theme === "dark" ? (
        <button onClick={() => setTheme("light")}>
          <Sun className="w-6 h-6" />
        </button>
      ) : (
        <button onClick={() => setTheme("dark")}>
          <Moon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}