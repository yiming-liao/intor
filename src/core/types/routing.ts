/**
 * URL carriers that can directly encode locale information.
 *
 * Represents structural parts of the URL where a locale
 * can be embedded and round-tripped during routing.
 *
 * @example
 * ```text
 * path  -> /en/about
 * query -> ?lang=en
 * host  -> en.example.com
 * ```
 *
 * @public
 */
export type RoutingLocaleCarrier = "path" | "host" | "query";

/**
 * Signals considered during inbound locale resolution.
 *
 * Includes URL carriers and non-URL hints such as cookies
 * or environment-based detection.
 *
 * Signals are evaluated deterministically according to configuration order.
 *
 * @public
 */
export type RoutingLocaleSignal = RoutingLocaleCarrier | "cookie" | "detected";

/**
 * Final source label describing how the locale was resolved.
 *
 * Includes all resolution signals plus the fallback `"default"`,
 * which indicates no configured signal matched.
 *
 * @public
 */
export type RoutingLocaleSource = RoutingLocaleSignal | "default";

/**
 * Controls how the locale is prefixed in URL pathnames.
 *
 * Applies only when the locale is carried in the path.
 *
 * - "none"           → Never prefix
 * - "all"            → Always prefix
 * - "except-default" → Prefix except for the default locale
 *
 * @public
 */
export type LocalePathPrefix = "none" | "all" | "except-default";
