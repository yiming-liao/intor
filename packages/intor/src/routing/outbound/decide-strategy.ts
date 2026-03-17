import type { OutboundTarget } from "./determine-target";
import type { IntorResolvedConfig } from "../../config";
import { shouldFullReload } from "../../policies";

export type OutboundStrategy = "external" | "client" | "reload";

/**
 * Decide how a resolved navigation target should be executed.
 */
export function decideStrategy(
  config: IntorResolvedConfig,
  target: OutboundTarget,
  currentLocale: string,
): OutboundStrategy {
  // External destinations are always handled by the browser
  if (target.isExternal) {
    return "external";
  }

  const isLocaleChange = target.locale !== currentLocale;

  if (isLocaleChange && shouldFullReload(config)) {
    return "reload";
  }

  return "client";
}
