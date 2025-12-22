import type { IntorResolvedConfig } from "@/config";
import type { LocaleContext, ResolvedLocale } from "@/routing/locale/types";

/**
 * Resolve the final locale based on routing configuration.
 *
 * - This function iterates through locale sources defined in
 * `config.routing.locale.sources` and returns the first
 * matching locale found in the provided context.
 *
 * - If no configured source yields a locale, the detected
 * locale is used as a guaranteed fallback.
 *
 * - The returned locale represents the single source of truth
 * for the remainder of the routing flow.
 */
export function resolveLocale(
  config: IntorResolvedConfig,
  context: LocaleContext,
): ResolvedLocale {
  const { sources } = config.routing.locale;

  for (const source of sources) {
    const locale = context[source]?.locale;
    if (!locale) continue;
    return {
      locale,
      source,
    };
  }

  // Fallback: detected is always available
  return {
    locale: context.detected.locale,
    source: "detected",
  };
}
