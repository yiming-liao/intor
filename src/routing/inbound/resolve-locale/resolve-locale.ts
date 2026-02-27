import type { LocaleContext, ResolvedLocale } from "./types";
import type { IntorResolvedConfig } from "../../../config";
import { matchLocale } from "../../../core";

/**
 * Resolves the active locale from inbound routing configuration.
 *
 * Resolution order:
 * 1. Configured locale signals (path / query / host / cookie)
 * 2. Runtime detection signal ("detected")
 * 3. Invariant fallback ("default")
 *
 * Always returns a supported locale.
 */
export function resolveLocale(
  config: IntorResolvedConfig,
  context: LocaleContext,
): ResolvedLocale {
  const { localeSources } = config.routing.inbound;

  // ------------------------------------------------------
  // 1. Configured resolution signals (policy-ordered)
  // ------------------------------------------------------
  for (const source of localeSources) {
    const locale = context[source]?.locale;

    const normalized = matchLocale(locale, config.supportedLocales);
    if (!normalized) continue;

    return {
      locale: normalized,
      localeSource: source,
    };
  }

  // ------------------------------------------------------
  // 2. Detection fallback (runtime signal)
  // ------------------------------------------------------
  const detected = matchLocale(
    context.detected?.locale,
    config.supportedLocales,
  );
  if (detected) {
    return {
      locale: detected,
      localeSource: "detected",
    };
  }

  // ------------------------------------------------------
  // 3. Final invariant fallback (guaranteed)
  // ------------------------------------------------------
  return {
    locale: config.defaultLocale,
    localeSource: "default",
  };
}
