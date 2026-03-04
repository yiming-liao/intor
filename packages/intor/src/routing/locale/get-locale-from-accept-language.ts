import type { IntorResolvedConfig } from "../../config";

/**
 * Get locale candidate from the `Accept-Language` header.
 *
 * Parses language priorities and returns the highest-priority
 * language present in `supportedLocales`, without normalization.
 *
 * @example
 * ```ts
 * getLocaleFromAcceptLanguage("en-US,en;q=0.8,zh-TW;q=0.9", ["en-US", "zh-TW"])
 * // => "en-US"
 *
 * getLocaleFromAcceptLanguage("fr,ja;q=0.9", ["en", "zh-TW"])
 * // => undefined
 * ```
 */
export const getLocaleFromAcceptLanguage = (
  acceptLanguageHeader: string | undefined | null,
  supportedLocales: IntorResolvedConfig["supportedLocales"],
): string | undefined => {
  if (!acceptLanguageHeader || supportedLocales.length === 0) {
    return;
  }

  const supportedLocalesSet = new Set(supportedLocales);

  // 1. Parse Accept-Language header into language + priority pairs
  const parsedLanguages = acceptLanguageHeader.split(",").map((part) => {
    const segments = part.split(";");
    const rawLang = segments[0]!;
    const rawQ = segments[1];
    const lang = rawLang.trim();
    const q =
      rawQ !== undefined ? Number.parseFloat(rawQ.split("=")[1] ?? "") : 1;
    return {
      lang,
      q: Number.isNaN(q) ? 0 : q, // Invalid q values have lowest priority
    };
  });

  // 2. Sort by priority (highest first)
  const sortedByPriority = parsedLanguages.sort((a, b) => b.q - a.q);

  // 3. Pick the first language explicitly supported
  const preferred = sortedByPriority.find(({ lang }) =>
    supportedLocalesSet.has(lang),
  )?.lang;

  return preferred;
};
