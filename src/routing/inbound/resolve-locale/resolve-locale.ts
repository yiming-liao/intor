import type { LocaleContext, ResolvedLocale } from "./types";
import type { IntorResolvedConfig } from "@/config";

/**
 * Resolves the active locale from inbound routing configuration.
 *
 * The first matching locale from the configured sources is used,
 * with the detected locale as a guaranteed fallback.
 */
export function resolveLocale(
  config: IntorResolvedConfig,
  context: LocaleContext,
): ResolvedLocale {
  const { localeSources } = config.routing.inbound;

  for (const source of localeSources) {
    const locale = context[source]?.locale;
    if (!locale) continue;
    return {
      locale,
      localeSource: source,
    };
  }

  // Fallback: detected is always available
  return {
    locale: context.detected.locale,
    localeSource: "detected",
  };
}
