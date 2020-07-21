import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import rusTranslation from './locales/ru.json';
import enTranslation from './locales/en.json';
import ukrTranslation from './locales/ukr.json';

const resources = {
  ru: {
    translation: rusTranslation,
  },
  en: {
    translation: enTranslation,
  },
  ukr: {
    translation: ukrTranslation,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });


export default i18n;
