'use client'

import { Moon, Sun } from 'lucide-react'
import React from 'react'
import { useTheme } from "next-themes";

export const ThemeToggler = () => {
  const {theme, setTheme} = useTheme()
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
  )
}
