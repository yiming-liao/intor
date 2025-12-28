import type { RoutingLocaleSource } from "@/core";

type RoutingPrefix = "none" | "all" | "except-default";

// Routing raw options
export type RoutingRawOptions = {
  locale?: {
    /** Priority order for resolving the active locale. */
    sources: Array<RoutingLocaleSource>;
    /** Query parameter key used for locale resolution. Defaults to "locale". */
    queryKey?: string;
  };

  /** Controls how locale prefixes appear in URLs. Defaults to "none". */
  prefix?: RoutingPrefix;

  /** Behavior applied on the user's first visit. */
  firstVisit?: {
    /** Determines which locale to use on first visit. Defaults to "browser" */
    localeSource?: "default" | "browser";
    /** Whether to redirect on first visit when locale is resolved. Defaults to true */
    redirect?: boolean;
    /** Whether to persist the resolved locale on the first visit. Defaults to true.*/
    persist?: boolean;
  };

  /** Base URL path for routing. Defaults to "/" */
  basePath?: string;

  /**
   * Force a full page reload when the locale changes.
   *
   * - This option mainly affects loaders that support client-side
   * locale switching (e.g. remote loaders).
   * - Local loaders always perform a full reload by design.
   */
  forceFullReload?: boolean;
};

// Routing resolved options
export type RoutingResolvedOptions = {
  locale: Required<NonNullable<RoutingRawOptions["locale"]>>;
  prefix: RoutingPrefix;
  firstVisit: Required<NonNullable<RoutingRawOptions["firstVisit"]>>;
  basePath: string;
  forceFullReload: boolean;
};
