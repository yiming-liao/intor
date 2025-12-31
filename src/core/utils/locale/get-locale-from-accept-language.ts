import type { IntorResolvedConfig } from "@/config";
import { normalizeLocale } from "../normalizers";

/**
 * Resolve locale from the `Accept-Language` header.
 *
 * - Parses language priorities (`q` values) from the header.
 * - Selects the highest-priority language supported by the application.
 * - Normalizes the matched locale against `supportedLocales`.
 *
 * If no supported locale can be resolved, `undefined` is returned.
 *
 * @example
 * ```ts
 * getLocaleFromAcceptLanguage("en-US,en;q=0.8,zh-TW;q=0.9", ["en-US", "zh-TW"])
 * // => "en-US"
 * getLocaleFromAcceptLanguage("fr,ja;q=0.9", ["en", "zh-TW"])
 * // => undefined
 * ```
 */
export const getLocaleFromAcceptLanguage = (
  config: IntorResolvedConfig,
  acceptLanguageHeader: string | undefined | null,
): string | undefined => {
  const { supportedLocales } = config;

  if (
    !acceptLanguageHeader ||
    !supportedLocales ||
    supportedLocales.length === 0
  ) {
    return;
  }

  const supportedLocalesSet = new Set(supportedLocales);

  // 1. Parse Accept-Language header into language + priority pairs
  const parsedLanguages = acceptLanguageHeader.split(",").map((part) => {
    const [rawLang, rawQ] = part.split(";");
    const lang = rawLang.trim();

    const q = rawQ ? Number.parseFloat(rawQ.split("=")[1]) : 1;

    return {
      lang,
      q: Number.isNaN(q) ? 0 : q, // Invalid q values have lowest priority
    };
  });

  // 2. Sort by priority (highest first)
  const sortedByPriority = parsedLanguages.toSorted((a, b) => b.q - a.q);

  // 3. Pick the first language explicitly supported
  const preferred = sortedByPriority.find(({ lang }) =>
    supportedLocalesSet.has(lang),
  )?.lang;

  return normalizeLocale(preferred, supportedLocales);
};
