import type { RoutingResolvedOptions } from "../types";

// Default routing options
export const DEFAULT_ROUTING_OPTIONS: RoutingResolvedOptions = {
  locale: {
    sources: ["path", "query", "cookie", "detected"],
    query: { key: "locale" },
  },
  navigation: {
    carrier: "path",
    path: { prefix: "none" },
    query: { key: "locale" },
    host: { map: {} },
  },
  firstVisit: {
    localeSource: "browser",
    redirect: true,
    persist: true,
  },
  basePath: "/",
  forceFullReload: false,
};
