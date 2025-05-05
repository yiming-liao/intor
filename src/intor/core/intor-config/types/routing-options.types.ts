export const routingPrefix = ["none", "all", "except-default"] as const;
export type RoutingPrefix = (typeof routingPrefix)[number];

export const routingFirstVisitLocaleSource = ["default", "browser"] as const;

// Init routing options
export type InitRoutingOptions = {
  prefix?: (typeof routingPrefix)[number]; // default: "all"
  firstVisit?: {
    localeSource?: (typeof routingFirstVisitLocaleSource)[number]; // default: "browser"
    redirect?: boolean; // default: true
  };
  basePath?: string; // default: ""
};

// Resolved routing options
export type ResolvedRoutingOptions = Required<InitRoutingOptions>;
