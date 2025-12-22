import type { RoutingResolvedOptions } from "@/config/types/routing.types";

// Default routing options
export const DEFAULT_ROUTING_OPTIONS: RoutingResolvedOptions = {
  locale: { sources: ["path", "cookie", "detected"] as const },
  prefix: "none",
  firstVisit: {
    localeSource: "browser",
    redirect: true,
  },
  basePath: "/",
};
