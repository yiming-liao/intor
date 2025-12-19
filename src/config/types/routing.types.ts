export const ROUTING_PREFIX = ["none", "all", "except-default"] as const;
export const ROUTING_FIRST_VISIT_LOCALE_SOURCE = [
  "default",
  "browser",
] as const;

// Routing raw options
export type RoutingRawOptions = {
  /** Controls how locale prefixes appear in URLs. Defaults to "none" */
  prefix?: (typeof ROUTING_PREFIX)[number];
  /** Behavior applied on the user's first visit. */
  firstVisit?: {
    /** Determines which locale to use on first visit. Defaults to "browser" */
    localeSource?: (typeof ROUTING_FIRST_VISIT_LOCALE_SOURCE)[number];
    /** Whether to redirect on first visit when locale is resolved. Defaults to true */
    redirect?: boolean;
  };
  /** Base URL path for routing. Defaults to "" */
  basePath?: string;
};

// Routing resolved options
export type RoutingResolvedOptions = Required<RoutingRawOptions>;
