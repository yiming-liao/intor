import type { IntorInitConfig } from "@/intor/core/intor-config/types/define-intor-config.types";
import type { IntorLogger } from "@/intor/core/intor-logger/intor-logger";
import type {
  Locale,
  FallbackLocalesMap,
} from "@/intor/types/message-structure-types";

type Params = {
  config: IntorInitConfig;
  supportedLocales: readonly Locale[];
  logger: IntorLogger;
};

export const resolveFallbackLocales = ({
  config,
  supportedLocales,
  logger,
}: Params): FallbackLocalesMap => {
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
    logger.warn(
      `Invalid fallback locales for "${locale}": ${invalids.join(", ")}`,
    );
  }

  return validMap;
};
