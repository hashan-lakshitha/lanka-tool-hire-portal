'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import '@/lib/i18n';

const LANGUAGES = [
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'si', label: 'සිං', fullName: 'සිංහල' },
  { code: 'ta', label: 'தம', fullName: 'தமிழ்' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded bg-[#2c3e50] p-1 text-xs text-gray-300">
        <Globe size={13} className="text-gray-400 ml-1" />
        <span className="px-1.5 py-0.5 font-bold text-white bg-[#3498db] rounded">EN</span>
      </div>
    );
  }

  const currentLang = i18n.language?.startsWith('si')
    ? 'si'
    : i18n.language?.startsWith('ta')
    ? 'ta'
    : 'en';

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    try {
      localStorage.setItem('i18nextLng', langCode);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div
      className="flex items-center gap-1 rounded bg-[#2c3e50] border border-gray-600/40 p-0.5"
      role="group"
      aria-label="Language selection"
    >
      <Globe size={13} className="text-gray-400 ml-1.5 mr-0.5" />
      {LANGUAGES.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleLanguageChange(lang.code)}
            title={lang.fullName}
            className={`rounded px-2 py-0.5 text-xs font-semibold transition-all ${
              isActive
                ? 'bg-[#3498db] text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
