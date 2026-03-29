// @zentto/studio-core — i18n locale resolver

import { es } from './es.js';
import { en } from './en.js';
import { pt } from './pt.js';

type LocaleStrings = Record<string, string>;

const locales: Record<string, LocaleStrings> = { es, en, pt };

let currentLocale = 'es';

/** Set the active locale */
export function setLocale(locale: string): void {
  currentLocale = locale;
}

/** Get the active locale */
export function getLocale(): string {
  return currentLocale;
}

/** Register a custom locale */
export function registerLocale(locale: string, strings: LocaleStrings): void {
  locales[locale] = strings;
}

/**
 * Translate a key, with optional interpolation.
 * Falls back to Spanish, then returns the key itself.
 */
export function t(key: string, params?: Record<string, string | number>): string {
  let str = locales[currentLocale]?.[key] ?? locales['es']?.[key] ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }

  return str;
}
