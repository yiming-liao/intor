import type { Locale } from "intor-translator";

/**
 * Determine whether locale synchronization is required.
 */
export function shouldSyncLocale(currentLocale: Locale, targetLocale: Locale) {
  return currentLocale !== targetLocale;
}
