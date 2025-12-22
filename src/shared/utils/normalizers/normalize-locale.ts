// Util
const toCanonical = (input: string): string | undefined => {
  try {
    return Intl.getCanonicalLocales(input)[0]?.toLowerCase();
  } catch {
    return;
  }
};

/**
 * Normalizes and finds the best matching locale from the supported locales list.
 */
export const normalizeLocale = <Locale extends string>(
  locale: string = "",
  supportedLocales: readonly Locale[] = [],
): Locale | undefined => {
  if (!locale || supportedLocales.length === 0) return;

  const canonicalLocale = toCanonical(locale);
  if (!canonicalLocale) return;

  const supportedCanonicalMap = new Map<string, Locale>();
  for (const l of supportedLocales) {
    const normalized = toCanonical(l);
    if (normalized) {
      supportedCanonicalMap.set(normalized, l);
    }
  }

  // 1. Exact match
  if (supportedCanonicalMap.has(canonicalLocale)) {
    return supportedCanonicalMap.get(canonicalLocale);
  }

  const baseLang = canonicalLocale.split("-")[0];

  // 2. Match by same base language (e.g., "en" matches "en-US" or "en-GB")
  for (const [key, original] of supportedCanonicalMap) {
    const supportedBase = key.split("-")[0];
    if (supportedBase === baseLang) {
      return original;
    }
  }

  // 3. No match
  return;
};
