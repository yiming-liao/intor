import type {
  RoutingFlatOptions,
  RoutingRawOptions,
  RoutingResolvedOptions,
  RoutingStructuredOptions,
} from "../types/routing";
import { deepMerge } from "../../core";
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

  const projectedFromFlat = projectFlatToStructured(raw);
  const structuredOverrides = stripFlatShortcuts(raw);
  const defined = deepMerge(projectedFromFlat, structuredOverrides);

  return deepMerge(DEFAULT_ROUTING_OPTIONS, defined);
}

/** Assigns a value to the target only if it is explicitly defined. */
function assignIfDefined<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K] | undefined,
) {
  if (value !== undefined) target[key] = value;
}

/** Projects flat routing shortcuts into structured options. */
function projectFlatToStructured(
  flat: RoutingFlatOptions,
): RoutingStructuredOptions {
  const structured: RoutingStructuredOptions = {};
  assignIfDefined(structured, "basePath", flat.basePath);
  assignIfDefined(structured, "localePrefix", flat.localePrefix);
  // inbound
  const inbound: RoutingStructuredOptions["inbound"] = {};
  assignIfDefined(inbound, "localeSources", flat.localeSources);
  assignIfDefined(inbound, "queryKey", flat.queryKey);
  assignIfDefined(inbound, "firstVisit", flat.firstVisit);
  if (Object.keys(inbound).length > 0) structured.inbound = inbound;
  // outbound
  const outbound: RoutingStructuredOptions["outbound"] = {};
  assignIfDefined(outbound, "localeCarrier", flat.localeCarrier);
  assignIfDefined(outbound, "queryKey", flat.queryKey);
  assignIfDefined(outbound, "host", flat.host);
  assignIfDefined(outbound, "forceFullReload", flat.forceFullReload);
  if (Object.keys(outbound).length > 0) structured.outbound = outbound;
  return structured;
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
