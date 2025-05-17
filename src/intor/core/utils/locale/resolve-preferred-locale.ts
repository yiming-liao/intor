import type { Locale } from "../../../types/message-structure-types";

/**
 * Resolves the preferred locale based on the Accept-Language header and supported locales.
 *
 * @param {string | undefined} acceptLanguageHeader - The Accept-Language header from the request.
 * @param {readonly Locale[] | undefined} supportedLocales - A list of supported locales.
 * @returns {string | undefined} The preferred locale, or undefined if no match is found.
 */
export const resolvePreferredLocale = (
  acceptLanguageHeader: string | undefined,
  supportedLocales?: readonly Locale[],
): string | undefined => {
  if (
    !acceptLanguageHeader ||
    !supportedLocales ||
    supportedLocales.length === 0
  ) {
    return;
  }

  const supportedLocalesSet = new Set(supportedLocales);

  const preferred = acceptLanguageHeader
    .split(",")
    .map((part) => {
      const [lang, qValue] = part.split(";");
      const q = qValue ? parseFloat(qValue.split("=")[1]) : 1;
      if (isNaN(q)) {
        return { lang: lang.trim(), q: 0 }; // Treat invalid q values as having 0 priority
      }
      return { lang: lang.trim(), q };
    })
    .sort((a, b) => b.q - a.q)
    .find(({ lang }) => supportedLocalesSet.has(lang))?.lang;

  return preferred;
};
