'use client';

import '@/lib/i18n';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }) {
  useEffect(() => {
    // Keep <html lang> in sync with the active UI language (screen readers, fonts, SEO).
    const syncHtmlLang = (lng) => {
      if (typeof document !== 'undefined' && lng) {
        document.documentElement.lang = lng.slice(0, 2);
      }
    };
    i18n.on('languageChanged', syncHtmlLang);

    try {
      const savedLng = localStorage.getItem('i18nextLng');
      if (savedLng && ['en', 'si', 'ta'].includes(savedLng)) {
        i18n.changeLanguage(savedLng);
      } else {
        const browserLang = navigator?.language?.slice(0, 2);
        if (['en', 'si', 'ta'].includes(browserLang)) {
          i18n.changeLanguage(browserLang);
        }
      }
    } catch {
      // Ignore storage errors
    }
    syncHtmlLang(i18n.language);

    return () => i18n.off('languageChanged', syncHtmlLang);
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}