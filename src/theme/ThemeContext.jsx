import { useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './context';

const THEME_KEY = 'ushanka-theme';

function readInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // ignore
  }
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#1a1430' : '#5b6ee1');
    }
  }, [theme]);

  const value = useMemo(() => {
    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    return { theme, setTheme, toggleTheme };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
