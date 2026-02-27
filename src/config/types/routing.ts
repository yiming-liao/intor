import type {
  RoutingLocaleSignal,
  RoutingLocaleCarrier,
  LocalePathPrefix,
} from "../../core";

// Structure routing options
export type RoutingStructuredOptions = {
  /** Base URL path for routing. Defaults to "/" */
  basePath?: string;
  /** Controls how locale prefixes appear in path URLs. Defaults to `none`.*/
  localePrefix?: LocalePathPrefix;
  /** Inbound routing configuration. */
  inbound?: {
    /** Ordered sources used to resolve the active locale. */
    localeSources?: RoutingLocaleSignal[];
    /** Query parameter key used when resolving locale from the URL. */
    queryKey?: string;
    /** Behavior applied on the user's first visit. */
    firstVisit?: {
      /** Locale source used on first visit. Defaults to "browser" */
      localeSource?: "default" | "browser";
      /** Whether to redirect after resolving locale. Defaults to true */
      redirect?: boolean;
      /** Whether to persist the resolved locale. Defaults to true.*/
      persist?: boolean;
    };
  };
  /** Outbound routing configuration. */
  outbound?: {
    /** URL carrier used to represent locale in navigation URLs. */
    localeCarrier?: RoutingLocaleCarrier;
    /** Query parameter key used when generating locale-aware URLs. */
    queryKey?: string;
    /** Host-based routing configuration. */
    host?: {
      /** Locale-to-host mapping used for host-based routing. */
      map: Record<string, string>;
      /** Fallback host used when no locale mapping is found. */
      default?: string;
    };
    /**
     * Forces a full page reload when the active locale changes.
     *
     * Note:
     * - If no client loader is specified and the shared loader is "local",
     *   a full reload is automatically triggered
     * - This option allows forcing the same behavior for remote loaders
     */
    forceFullReload?: boolean;
  };
};

// Routing raw options
export type RoutingRawOptions = RoutingStructuredOptions & RoutingFlatOptions;

// Routing resolved options
export type RoutingResolvedOptions = {
  basePath: string;
  localePrefix: LocalePathPrefix;
  inbound: {
    localeSources: RoutingLocaleSignal[];
    queryKey: string;
    firstVisit: {
      localeSource: "default" | "browser";
      redirect: boolean;
      persist: boolean;
    };
  };
  outbound: {
    localeCarrier: RoutingLocaleCarrier;
    queryKey: string;
    host: {
      map: Record<string, string>;
      default?: string;
    };
    forceFullReload: boolean;
  };
};

// ---------------------------------------------------------------------------
// Flat (shortcut) routing options
// ---------------------------------------------------------------------------
export interface RoutingFlatOptions {
  basePath?: string;
  localePrefix?: LocalePathPrefix;
  queryKey?: string; // (shared)
  localeSources?: RoutingLocaleSignal[];
  firstVisit?: NonNullable<RoutingStructuredOptions["inbound"]>["firstVisit"];
  localeCarrier?: RoutingLocaleCarrier;
  host?: NonNullable<RoutingStructuredOptions["outbound"]>["host"];
  forceFullReload?: boolean;
}
