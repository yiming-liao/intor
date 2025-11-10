import { Locale } from "intor-translator";

/**
 * Resolves the preferred locale based on the Accept-Language header and supported locales.
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
