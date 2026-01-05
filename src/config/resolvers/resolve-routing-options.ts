import type {
  RoutingFlatOptions,
  RoutingRawOptions,
  RoutingResolvedOptions,
  RoutingStructuredOptions,
} from "../types/routing";
import { deepMerge } from "@/core";
import { DEFAULT_ROUTING_OPTIONS } from "../constants";

/**
 * Resolves routing configuration into a fully normalized form.
 *
 * - Flat shortcuts are projected into structured options.
 * - Structured options override projected values.
 * - Defaults are applied last.
 */
export function resolveRoutingOptions(
  raw?: RoutingRawOptions,
): RoutingResolvedOptions {
  if (!raw) return DEFAULT_ROUTING_OPTIONS;

  const projected = projectFlatToStructured(raw);
  const structuredOverrides = stripFlatShortcuts(raw);
  const defined = deepMerge(projected, structuredOverrides);

  return deepMerge(DEFAULT_ROUTING_OPTIONS, defined);
}

/** Projects flat routing shortcuts into structured options. */
function projectFlatToStructured(
  flat: RoutingFlatOptions,
): RoutingStructuredOptions {
  return {
    basePath: flat.basePath,
    localePrefix: flat.localePrefix,
    inbound: {
      localeSources: flat.localeSources,
      queryKey: flat.queryKey,
      firstVisit: flat.firstVisit,
    },
    outbound: {
      localeCarrier: flat.localeCarrier,
      queryKey: flat.queryKey,
      host: flat.host,
      forceFullReload: flat.forceFullReload,
    },
  };
}

/** Removes flat shortcuts, preserving structured overrides only. */
function stripFlatShortcuts(raw: RoutingRawOptions): RoutingStructuredOptions {
  const structured: RoutingStructuredOptions = {};
  if ("basePath" in raw) structured.basePath = raw.basePath;
  if ("localePrefix" in raw) structured.localePrefix = raw.localePrefix;
  if ("inbound" in raw) structured.inbound = raw.inbound;
  if ("outbound" in raw) structured.outbound = raw.outbound;
  return structured;
}
