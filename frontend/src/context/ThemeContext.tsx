import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light')
  const [isDark, setIsDark] = useState(false)

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme-mode') as ThemeMode | null
    if (saved && (saved === 'light' || saved === 'dark')) {
      setMode(saved)
    }
  }, [])

  // Update dark mode based on mode
  useEffect(() => {
    const shouldBeDark = mode === 'dark'
    setIsDark(shouldBeDark)

    // Update HTML element class
    const html = document.documentElement
    if (shouldBeDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [mode])

  const handleSetMode = (newMode: ThemeMode) => {
    setMode(newMode)
    localStorage.setItem('theme-mode', newMode)
  }

  const toggleTheme = () => {
    handleSetMode(mode === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode: handleSetMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
