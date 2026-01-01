import type { PathnameContext, PathnameDirective } from "../types";
/**
 * Resolve pathname decision for routing prefix strategy: "none".
 */
export function none(context: PathnameContext): PathnameDirective {
  const { localeSource } = context;

  // cookie locale present
  if (localeSource === "cookie") {
    return { type: "pass" };
  }

  // no cookie locale (first visit)
  return { type: "pass" };
}
