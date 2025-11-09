import { RoutingResolvedOptions } from "@/modules/config/types/routing.types";

// Default routing options
export const DEFAULT_ROUTING_OPTIONS: RoutingResolvedOptions = {
  prefix: "all",
  firstVisit: {
    localeSource: "browser",
    redirect: true,
  },
  basePath: "/",
};
