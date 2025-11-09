import { FallbackLocalesMap, Locale } from "intor-translator";
import { IntorRawConfig } from "@/modules/config/types/intor-config.types";

export const resolveFallbackLocales = (
  config: IntorRawConfig,
  supportedLocales?: readonly Locale[],
): FallbackLocalesMap => {
  const { defaultLocale, fallbackLocales } = config;

  if (!fallbackLocales || typeof fallbackLocales !== "object") {
    return {};
  }

  const supportedSet = new Set(supportedLocales);
  const validMap: FallbackLocalesMap = {}; // Collected valid fallbacks
  const invalidFallbackMap = new Map<Locale, Locale[]>(); // Track invalid ones

  for (const [locale, fallbacks] of Object.entries(fallbackLocales)) {
    const fallbackArray = Array.isArray(fallbacks) ? fallbacks : [];

    // Valid: in supported list, matches default, or literal "default"
    const validFallbacks = fallbackArray.filter(
      (fallback) =>
        fallback === "default" ||
        supportedSet.has(fallback as Locale) ||
        fallback === defaultLocale,
    );

    // Invalid: not "default", not supported, and not defaultLocale
    const invalidFallbacks = fallbackArray.filter(
      (fallback) =>
        fallback !== "default" &&
        !supportedSet.has(fallback as Locale) &&
        fallback !== defaultLocale,
    );

    if (invalidFallbacks.length > 0) {
      invalidFallbackMap.set(locale as Locale, invalidFallbacks);
    }

    if (validFallbacks.length > 0) {
      validMap[locale as Locale] = validFallbacks;
    }
  }

  // Log out invalid fallback locales
  for (const [locale, invalids] of invalidFallbackMap.entries()) {
    console.warn(
      `Invalid fallback locales for "${locale}"`,
      { invalids: [...invalids] },
      { scope: "resolveFallbackLocales" },
    );
  }

  return validMap;
};
