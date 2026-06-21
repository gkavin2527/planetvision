'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
}>({
  theme: 'light',
  toggle: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize from the class the anti-FOUC script already set on <html>.
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setThemeState(isDark ? 'dark' : 'light')
  }, [])

  const apply = useCallback((t: Theme) => {
    setThemeState(t)
    const root = document.documentElement
    root.classList.toggle('dark', t === 'dark')
    try {
      localStorage.setItem('theme', t)
    } catch {}
  }, [])

  const toggle = useCallback(
    () => apply(theme === 'dark' ? 'light' : 'dark'),
    [theme, apply]
  )

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme: apply }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

/**
 * Runs before paint to set the initial theme class and avoid a flash.
 * Injected as a raw <script> in the document head.
 */
export const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`
