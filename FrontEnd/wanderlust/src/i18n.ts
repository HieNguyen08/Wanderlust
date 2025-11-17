import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import vi from './locales/vi.json';

// Get stored language or default to Vietnamese
const storedLanguage = localStorage.getItem('i18nextLng') || 'vi';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
      ja: { translation: ja },
      ko: { translation: ko },
    },
    lng: storedLanguage,
    fallbackLng: false, // Disable fallback to prevent auto-switching
    supportedLngs: ['vi', 'en', 'ja', 'ko'],
    nonExplicitSupportedLngs: false,
    load: 'currentOnly',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
