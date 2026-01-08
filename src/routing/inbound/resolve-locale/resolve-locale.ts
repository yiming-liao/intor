import type { LocaleContext, ResolvedLocale } from "./types";
import type { IntorResolvedConfig } from "@/config";
import { normalizeLocale } from "@/core";

/**
 * Resolve the active locale from inbound routing configuration.
 *
 * Iterates through configured locale sources and returns the first
 * normalized, supported locale. Falls back to the detected locale
 * or the default locale if none match.
 */
export function resolveLocale(
  config: IntorResolvedConfig,
  context: LocaleContext,
): ResolvedLocale {
  const { localeSources } = config.routing.inbound;

  for (const source of localeSources) {
    const locale = context[source]?.locale;

    const normalized = normalizeLocale(locale, config.supportedLocales);
    if (!normalized) continue;

    return {
      locale: normalized,
      localeSource: source,
    };
  }

  // Fallback: detected is always available
  return {
    locale:
      normalizeLocale(context.detected.locale, config.supportedLocales) ||
      config.defaultLocale,
    localeSource: "detected",
  };
}
