/**
 * URL carriers that can directly carry locale information.
 *
 * A carrier represents a structural part of the URL where
 * the locale is encoded and can be round-tripped between
 * inbound resolution and outbound navigation.
 *
 * @example
 *```plain
 * path  -> /en/about
 * query -> ?lang=en
 * host  -> en.example.com
 * ```
 */
export type RoutingLocaleCarrier = "path" | "host" | "query";

/**
 * Locale resolution sources used by routing configuration.
 *
 * A source represents a resolved input that can influence
 * the active locale during routing.
 *
 * Sources include:
 * - URL carriers (path / query / host), which are part of the URL
 * - Non-URL inputs (cookie / detected), which provide
 *   environment or persisted hints
 *
 * This type represents resolved data sources, not detection strategies.
 */
export type RoutingLocaleSource = RoutingLocaleCarrier | "cookie" | "detected";

/**
 * Controls how the locale is prefixed in URL pathnames.
 *
 * This option defines whether the locale appears in the path,
 * and under what conditions.
 *
 * Applicable only when the locale is carried in the path.
 *
 * - "none"           → No locale prefix is applied
 * - "all"            → Locale prefix is always applied
 * - "except-default" → Locale prefix is applied except for the default locale
 */
export type LocalePathPrefix = "none" | "all" | "except-default";
