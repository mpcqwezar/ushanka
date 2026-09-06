import { useEffect, useMemo, useState } from 'react';
import { translations } from './translations';
import { LanguageContext } from './context';

const LANG_KEY = 'ushanka-lang';

function readInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'ru') return saved;
  } catch {
    // ignore
  }
  return 'ru';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readInitialLang);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
    document.title = translations[lang].brand;
  }, [lang]);

  const value = useMemo(() => {
    const t = translations[lang];
    const toggleLang = () => setLang((prev) => (prev === 'ru' ? 'en' : 'ru'));
    return { lang, setLang, toggleLang, t };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
