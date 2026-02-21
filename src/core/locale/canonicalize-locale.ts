/**
 * Canonicalizes a BCP 47 locale string.
 *
 * - Uses `Intl.getCanonicalLocales` when available.
 * - Returns the original input if `Intl` is unavailable.
 * - Returns `undefined` for invalid locale input.
 *
 * This function performs normalization only.
 * It does not perform matching or fallback.
 */
export function canonicalizeLocale(input: string): string | undefined {
  try {
    if (typeof Intl === "undefined" || !Intl.getCanonicalLocales) {
      return input;
    }
    return Intl.getCanonicalLocales(input)[0];
  } catch {
    return;
  }
}
