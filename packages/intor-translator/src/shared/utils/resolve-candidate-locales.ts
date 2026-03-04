import type { FallbackLocalesMap } from "../../types";

/**
 * Resolve a prioritized list of locales to attempt based on a primary locale.
 *
 * @example
 * ```ts
 * const fallbackLocalesMap = {
 *   "zh-TW": ["zh", "en"],
 *   "en": ["zh-TW"]
 * };
 *
 * resolveCandidateLocales("zh-TW", fallbackLocalesMap); // → ["zh-TW", "zh", "en"]
 * resolveCandidateLocales("en", fallbackLocalesMap); // → ["en", "zh-TW"]
 * resolveCandidateLocales("zh-TW"); // → ["zh-TW"]
 * ```
 */
export const resolveCandidateLocales = (
  locale: string,
  fallbackLocalesMap?: FallbackLocalesMap<string>,
): string[] => {
  const fallbacks = fallbackLocalesMap?.[locale] || [];
  const filteredFallbacks = fallbacks.filter((l) => l !== locale);
  return [locale, ...filteredFallbacks];
};
