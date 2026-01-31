import type { PathContext, PathDirective } from "../types";
import type { IntorResolvedConfig } from "@/config";

/**
 * Resolve pathname decision for routing prefix strategy: "all".
 */
export function all(
  config: IntorResolvedConfig,
  context: PathContext,
): PathDirective {
  const { hasPathLocale, hasPersisted, hasRedirected } = context;
  const { redirect } = config.routing.inbound.firstVisit;
  const isFirstVisit = !hasPersisted;

  // ----------------------------------------------------------
  // URL already canonical
  // ----------------------------------------------------------
  if (hasPathLocale) {
    return { type: "pass" };
  }

  // ----------------------------------------------------------
  // Prevent infinite redirect in the same navigation flow
  // ----------------------------------------------------------
  if (hasRedirected) {
    return { type: "pass" };
  }

  // ----------------------------------------------------------
  // Apply first-visit redirect policy
  // ----------------------------------------------------------
  if (isFirstVisit) {
    if (!redirect) return { type: "pass" };
    return { type: "redirect" };
  }

  // ----------------------------------------------------------
  // Redirect to the locale-prefixed URL
  // ----------------------------------------------------------
  return { type: "redirect" };
}
