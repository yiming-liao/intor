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
  const parsedLanguages = acceptLanguageHeader.split(",").flatMap((part) => {
    const segments = part.split(";");
    // Each entry permits one optional weight; skip malformed entries only.
    if (segments.length > 2) return [];
    const rawLang = segments[0]!;
    const rawQ = segments[1];
    const lang = rawLang.trim();
    if (rawQ === undefined) return [{ lang, q: 1 }];

    // RFC 9110 qvalue: at most three decimals, and only zeros after 1.
    const weight = /^q=(0(?:\.[0-9]{0,3})?|1(?:\.0{0,3})?)$/i.exec(rawQ.trim());
    if (!weight) return [];
    return [{ lang, q: Number(weight[1]) }];
  });

  // 2. Sort by priority (highest first)
  const sortedByPriority = parsedLanguages.sort((a, b) => b.q - a.q);

  // 3. Pick the first acceptable language explicitly supported (q=0 excludes it)
  const preferred = sortedByPriority.find(
    ({ lang, q }) => q > 0 && supportedLocalesSet.has(lang),
  )?.lang;

  return preferred;
};
