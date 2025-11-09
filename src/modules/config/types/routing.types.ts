export const routingPrefix = ["none", "all", "except-default"] as const;
export type RoutingPrefix = (typeof routingPrefix)[number];

export const routingFirstVisitLocaleSource = ["default", "browser"] as const;

// Routing raw options
export type RoutingRawOptions = {
  /** default: "all" */
  prefix?: (typeof routingPrefix)[number];
  firstVisit?: {
    /** default: "browser" */
    localeSource?: (typeof routingFirstVisitLocaleSource)[number];
    /** default: true */
    redirect?: boolean;
  };
  /** default: "" */
  basePath?: string;
};

// Routing resolved options
export type RoutingResolvedOptions = Required<RoutingRawOptions>;
