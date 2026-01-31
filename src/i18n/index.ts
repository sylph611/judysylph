import ko from './ko.json';
import en from './en.json';

export const languages = {
  ko: '한국어',
  en: 'English'
};

export const defaultLang = 'ko';

export const translations = { ko, en } as const;

export type Lang = keyof typeof translations;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const keys = key.split('.');

    // Try current language first
    let value: any = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    if (value) return value;

    // Fallback to English if not default language
    if (lang !== 'en') {
      let fallbackValue: any = translations['en'];
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k];
      }
      if (fallbackValue) return fallbackValue;
    }

    // Fallback to Korean as last resort
    if (lang !== 'ko') {
      let fallbackValue: any = translations['ko'];
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k];
      }
      if (fallbackValue) return fallbackValue;
    }

    // Return key if nothing found
    return key;
  };
}

export function getAlternateLocaleUrl(currentUrl: URL, targetLang: Lang): string {
  const pathParts = currentUrl.pathname.split('/');
  if (pathParts[1] in translations) {
    pathParts[1] = targetLang;
  } else {
    pathParts.splice(1, 0, targetLang);
  }
  return pathParts.join('/') || '/';
}
