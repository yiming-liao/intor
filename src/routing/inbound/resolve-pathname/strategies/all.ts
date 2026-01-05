import type { PathnameContext, PathnameDirective } from "../types";
import type { IntorResolvedConfig } from "@/config";

/**
 * Resolve pathname decision for routing prefix strategy: "all".
 */
export function all(
  context: PathnameContext,
  config: IntorResolvedConfig,
): PathnameDirective {
  const { localeSource } = context;
  const { redirect } = config.routing.inbound.firstVisit;

  // path locale present
  if (localeSource === "path") {
    return { type: "pass" };
  }

  // no path locale, cookie locale present
  if (localeSource === "cookie") {
    return { type: "redirect" };
  }

  // no path locale, no cookie locale (first visit)
  return !redirect
    ? // - redirect disabled → pass
      { type: "pass" }
    : // - redirect enabled → redirect
      { type: "redirect" };
}
