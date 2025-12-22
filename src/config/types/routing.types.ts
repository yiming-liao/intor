import type { RoutingLocaleSource } from "@/shared/types/routing";

type RoutingPrefix = "none" | "all" | "except-default";

// Routing raw options
export type RoutingRawOptions = {
  locale?: {
    /** Priority order for resolving locale */
    sources: Array<RoutingLocaleSource>;
  };
  /** Controls how locale prefixes appear in URLs. Defaults to "none" */
  prefix?: RoutingPrefix;
  /** Behavior applied on the user's first visit. */
  firstVisit?: {
    /** Determines which locale to use on first visit. Defaults to "browser" */
    localeSource?: "default" | "browser";
    /** Whether to redirect on first visit when locale is resolved. Defaults to true */
    redirect?: boolean;
  };
  /** Base URL path for routing. Defaults to "/" */
  basePath?: string;
};

// Routing resolved options
export type RoutingResolvedOptions = {
  locale: NonNullable<RoutingRawOptions["locale"]>;
  prefix: RoutingPrefix;
  firstVisit: Required<NonNullable<RoutingRawOptions["firstVisit"]>>;
  basePath: string;
};
