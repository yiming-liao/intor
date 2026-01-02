import type {
  RoutingLocaleSource,
  RoutingLocaleCarrier,
  PathLocaleStrategy,
} from "@/core";

// Routing raw options
export type RoutingRawOptions = {
  locale?: {
    /** Ordered sources used to resolve the active locale. */
    sources: RoutingLocaleSource[];
    /** Query key used when resolving locale from URL query. */
    query?: { key: string };
  };
  navigation?: {
    /**
     * URL carrier used to represent locale in navigation URLs.
     *
     * @example
     *```plain
     * path  -> /en/about
     * query -> ?lang=en
     * host  -> en.example.com
     * ```
     */
    carrier?: RoutingLocaleCarrier;
    path?: {
      /** Controls how locale prefixes appear in path URLs. */
      prefix?: PathLocaleStrategy;
    };
    query?: {
      /** Query key used when resolving locale from URL query. */
      key: string;
    };
    host?: {
      /**
       * Locale-to-host mapping used for host-based routing.
       *
       * @example
       * ```ts
       * {
       *   en: "en.example.com",
       *   zh: "zh.example.com",
       * }
       * ```
       */
      map: Record<string, string>;
      /** Fallback host used when no locale mapping is found. */
      default?: string;
    };
  };
  /** Behavior applied on the user's first visit. */
  firstVisit?: {
    /** Locale source used on first visit. Defaults to "browser" */
    localeSource?: "default" | "browser";
    /** Whether to redirect after resolving locale. Defaults to true */
    redirect?: boolean;
    /** Whether to persist the resolved locale. Defaults to true.*/
    persist?: boolean;
  };
  /** Base URL path for routing. Defaults to "/" */
  basePath?: string;
  /**
   * Force a full page reload when locale changes.
   * - Local loaders always perform a full reload by design.
   */
  forceFullReload?: boolean;
};

// Routing resolved options
export type RoutingResolvedOptions = {
  locale: { sources: RoutingLocaleSource[]; query: { key: string } };
  navigation: {
    carrier: RoutingLocaleCarrier;
    path: { prefix: PathLocaleStrategy };
    query: { key: string };
    host: { map: Record<string, string>; default?: string };
  };
  firstVisit: {
    localeSource: "default" | "browser";
    redirect: boolean;
    persist: boolean;
  };
  basePath: string;
  forceFullReload: boolean;
};
