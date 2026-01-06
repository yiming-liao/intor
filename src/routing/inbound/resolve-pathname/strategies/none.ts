import type { PathnameDirective } from "../types";
/**
 * Resolve pathname decision for routing prefix strategy: "none".
 */
export function none(): PathnameDirective {
  return { type: "pass" };
}
