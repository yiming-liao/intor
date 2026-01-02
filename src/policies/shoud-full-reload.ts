import type { IntorResolvedConfig } from "@/config";
import { resolveLoaderOptions } from "@/core";

/**
 * Determine whether client-side navigation must be forced to reload.
 */
export function shouldFullReload(config: IntorResolvedConfig): boolean {
  const loader = resolveLoaderOptions(config, "client");
  return loader?.type === "local" || config.routing.forceFullReload === true;
}
