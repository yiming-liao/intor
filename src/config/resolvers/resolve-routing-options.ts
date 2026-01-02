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
      query: {
        ...DEFAULT_ROUTING_OPTIONS.locale.query,
        ...routing.locale?.query,
      },
    },

    navigation: {
      ...DEFAULT_ROUTING_OPTIONS.navigation,
      ...routing.navigation,

      path: {
        ...DEFAULT_ROUTING_OPTIONS.navigation.path,
        ...routing.navigation?.path,
      },

      query: {
        ...DEFAULT_ROUTING_OPTIONS.navigation.query,
        ...routing.navigation?.query,
      },

      host: {
        ...DEFAULT_ROUTING_OPTIONS.navigation.host,
        ...routing.navigation?.host,
      },
    },

    firstVisit: {
      ...DEFAULT_ROUTING_OPTIONS.firstVisit,
      ...routing.firstVisit,
    },

    basePath: normalizePathname(routing?.basePath || ""),
  };
};
