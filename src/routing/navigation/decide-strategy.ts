import type { NavigationTarget } from "./derive-target";
import type { IntorResolvedConfig } from "@/config";
import { shouldFullReload } from "@/policies";

type NavigationStrategy =
  | { kind: "external" } // handled by the browser
  | { kind: "client" } // client-side navigation
  | { kind: "reload" }; // full page reload

/**
 * Decide how a resolved navigation target should be executed.
 *
 * This function determines whether navigation should be handled
 * by the browser, performed client-side, or forced to reload.
 */
export function decideStrategy(
  config: IntorResolvedConfig,
  target: NavigationTarget,
): NavigationStrategy {
  // External destinations are always handled by the browser
  if (target.isExternal) {
    return { kind: "external" };
  }

  return shouldFullReload(config) ? { kind: "reload" } : { kind: "client" };
}
