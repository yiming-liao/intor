import type { ResolvedRoutingOptions } from "@/intor/core/intor-config/types/routing-options.types";

// Default routing options
export const DEFAULT_ROUTING_OPTIONS: ResolvedRoutingOptions = {
  prefix: "all",
  firstVisit: {
    localeSource: "browser",
    redirect: true,
  },
  basePath: "",
};
