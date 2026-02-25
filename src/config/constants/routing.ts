import type { RoutingResolvedOptions } from "../types";

// Default routing options
export const DEFAULT_ROUTING_OPTIONS: RoutingResolvedOptions = {
  basePath: "/",
  localePrefix: "none",
  inbound: {
    localeSources: ["path", "query", "cookie", "detected"],
    queryKey: "locale",
    firstVisit: { localeSource: "browser", persist: true, redirect: true },
  },
  outbound: {
    localeCarrier: "path",
    queryKey: "locale",
    host: { map: {} },
    forceFullReload: false,
  },
};
