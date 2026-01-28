import type { OutboundTarget } from "./determine-target";
import type { IntorResolvedConfig } from "@/config";
import { shouldFullReload } from "@/policies";

export type OutboundStrategy = "external" | "client" | "reload";

/**
 * Decide how a resolved navigation target should be executed.
 */
export function decideStrategy(
  config: IntorResolvedConfig,
  target: OutboundTarget,
): OutboundStrategy {
  // External destinations are always handled by the browser
  if (target.isExternal) {
    return "external";
  }

  return shouldFullReload(config) ? "reload" : "client";
}
