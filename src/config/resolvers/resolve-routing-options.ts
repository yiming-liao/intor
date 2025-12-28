import type { RoutingRawOptions, RoutingResolvedOptions } from "../types";
import { normalizePathname } from "@/core";
import { DEFAULT_ROUTING_OPTIONS } from "../constants";

export const resolveRoutingOptions = (
  routing: RoutingRawOptions = {},
): RoutingResolvedOptions => {
  return {
    ...DEFAULT_ROUTING_OPTIONS,
    ...routing,
    locale: {
      ...DEFAULT_ROUTING_OPTIONS.locale,
      ...routing.locale,
    },
    firstVisit: {
      ...DEFAULT_ROUTING_OPTIONS.firstVisit,
      ...routing.firstVisit,
    },
    basePath: normalizePathname(routing?.basePath || ""),
  };
};
