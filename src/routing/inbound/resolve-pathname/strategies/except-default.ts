import type { PathnameContext, PathnameDirective } from "../types";
import type { IntorResolvedConfig } from "@/config";

/**
 * Resolve pathname decision for routing prefix strategy: "except-default".
 */
export function exceptDefault(
  context: PathnameContext,
  config: IntorResolvedConfig,
): PathnameDirective {
  const { localeSource, locale } = context;
  const { redirect } = config.routing.inbound.firstVisit;

  const isDefaultLocale = locale === config.defaultLocale;

  // path locale present
  if (localeSource === "path") {
    return { type: "pass" };
  }

  // no path locale, cookie locale present
  if (localeSource === "cookie") {
    return isDefaultLocale
      ? // - default locale → pass
        { type: "pass" }
      : // - non-default locale → redirect to prefixed URL
        { type: "redirect" };
  }

  // no path locale, no cookie locale (first visit)
  // - redirect disabled → pass
  if (!redirect) {
    return { type: "pass" };
  }

  // - redirect enabled:
  return isDefaultLocale
    ? // -- default locale → pass
      { type: "pass" }
    : // -- non-default locale → redirect to prefixed URL
      { type: "redirect" };
}
