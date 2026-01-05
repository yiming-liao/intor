import type { IntorRawConfig } from "../types";
import type { FallbackLocalesMap, Locale } from "intor-translator";
import { getLogger } from "@/core";

/**
 * Resolves fallbackLocales into a runtime-safe mapping.
 *
 * Invalid entries are ignored and reported via warnings.
 */
export const resolveFallbackLocales = (
  config: IntorRawConfig,
  id: string,
  supportedSet: ReadonlySet<string>,
): FallbackLocalesMap => {
  const { defaultLocale, fallbackLocales } = config;

  // Fast exit: no fallback configuration provided
  if (!fallbackLocales || typeof fallbackLocales !== "object") {
    return {};
  }

  const logger = getLogger({ id }).child({
    scope: "resolve-fallback-locales",
  });

  const resolvedMap: FallbackLocalesMap = {};
  const invalidMap = new Map<Locale, Locale[]>();

  // ---------------------------------------------------------------------------
  // Normalize each fallback rule
  // ---------------------------------------------------------------------------
  for (const [locale, fallbacks] of Object.entries(fallbackLocales)) {
    // Guard: fallback rules for unreachable locales are ignored.
    if (!supportedSet.has(locale) && locale !== defaultLocale) {
      logger.warn(
        `Fallback locale "${locale}" is not listed in supportedLocales.`,
      );
      continue;
    }

    const fallbackArray = Array.isArray(fallbacks) ? fallbacks : [];
    const validFallbacks: string[] = [];
    const invalidFallbacks: string[] = [];

    for (const fallback of fallbackArray) {
      // A fallback target is considered valid if:
      // - It exists in `supportedLocales`
      // - It is the literal value "default"
      if (fallback === "default" || supportedSet.has(fallback)) {
        validFallbacks.push(fallback);
      } else {
        invalidFallbacks.push(fallback);
      }
    }
    if (invalidFallbacks.length > 0) invalidMap.set(locale, invalidFallbacks);
    if (validFallbacks.length > 0) resolvedMap[locale] = validFallbacks;
  }

  // ---------------------------------------------------------------------------
  // Diagnostics: report ignored fallback entries
  // ---------------------------------------------------------------------------
  for (const [locale, invalids] of invalidMap.entries()) {
    logger.warn(`Invalid fallback locales for "${locale}".`, {
      invalids: invalids.join(", "),
    });
  }

  return resolvedMap;
};
