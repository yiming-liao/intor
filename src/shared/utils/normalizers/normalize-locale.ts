const toCanonical = (input: string): string | undefined => {
  try {
    return Intl.getCanonicalLocales(input)[0];
  } catch {
    return;
  }
};

/**
 * Normalizes a locale string and resolves the best match
 * from a list of supported locales.
 *
 * Resolution strategy:
 *
 * 1. Exact canonical match (BCP 47)
 * 2. Base language fallback
 *    - Falls back by base language when no exact match is found
 *      (e.g. `"en"` → `"en-US"`).
 *    - Script and region subtags are ignored during this step
 *      (e.g. `"zh-Hans"` → `"zh-Hant-TW"`)
 *    - Preference is determined by the order of `supportedLocales`.
 *
 * Returns `undefined` if no suitable match is found.
 *
 * Notes:
 * - Invalid locale inputs are ignored gracefully.
 * - Always returns an original entry from `supportedLocales`.
 * - Requires `Intl` locale support in the runtime.
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
