import type { IntorResolvedConfig, LoaderOptions } from "@/config";

/**
 * Resolve the effective message loader for a given runtime.
 *
 * Loader resolution follows an inheritance-based priority model:
 *
 * - client runtime:
 *   client.loader → server.loader → root loader
 *
 * - server runtime:
 *   server.loader → root loader
 *
 * This allows the client runtime to inherit server behavior
 * when no explicit client loader is provided.
 *
 * Notes:
 * - Static `messages` are intentionally NOT handled here.
 * - Returning `undefined` indicates that no loader is enabled
 *   for the given runtime.
 */
export const resolveLoaderOptions = (
  config: IntorResolvedConfig,
  runtime: "client" | "server",
): LoaderOptions | undefined => {
  // --- runtime: client ---
  if (runtime === "client") {
    const client = config.client?.loader;
    if (client) {
      // Client loader is always remote by design
      return { type: "remote", ...client };
    }

    return config.server?.loader ?? config.loader;
  }

  // --- runtime: server ---
  return config.server?.loader ?? config.loader;
};
