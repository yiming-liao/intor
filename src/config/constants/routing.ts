import type { RoutingResolvedOptions } from "../types";

// Default routing options
export const DEFAULT_ROUTING_OPTIONS: RoutingResolvedOptions = {
  locale: {
    sources: ["path", "query", "cookie", "detected"] as const,
    queryKey: "locale",
  },
  prefix: "none",
  firstVisit: {
    localeSource: "browser",
    redirect: true,
    persist: true,
  },
  basePath: "/",
  forceFullReload: false,
};
