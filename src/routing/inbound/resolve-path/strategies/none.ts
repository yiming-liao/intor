import type { PathDirective } from "../types";

/**
 * Resolve pathname decision for routing prefix strategy: "none".
 */
export function none(): PathDirective {
  return { type: "pass" };
}
