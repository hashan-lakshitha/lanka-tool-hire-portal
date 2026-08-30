'use client';

import '@/lib/i18n';
import i18n from '@/lib/i18n';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }) {
  useEffect(() => {
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
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}