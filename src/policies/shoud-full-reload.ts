import type { IntorResolvedConfig } from "../config";
import { resolveLoaderOptions } from "../core";

/**
 * Determine whether client-side navigation must be forced to reload.
 */
export function shouldFullReload(config: IntorResolvedConfig): boolean {
  const loader = resolveLoaderOptions(config, "client");
  return (
    loader?.mode === "local" || config.routing.outbound.forceFullReload === true
  );
}
