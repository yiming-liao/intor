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
 * Locale resolution signals used by inbound routing configuration.
 *
 * A signal represents a candidate input that may influence
 * the active locale during resolution.
 *
 * Signals include:
 * - URL carriers (path / query / host), which are structural parts of the URL
 * - Non-URL hints (cookie / detected), which provide persisted or
 *   environment-based information
 *
 * Signals are ordered by configuration and evaluated
 * deterministically during locale resolution.
 */
export type RoutingLocaleSignal = RoutingLocaleCarrier | "cookie" | "detected";

/**
 * Final locale source label returned by resolution.
 *
 * Includes all possible resolution signals plus the
 * invariant fallback `"default"`.
 *
 * `"default"` indicates that no configured signal
 * produced a supported locale.
 */
export type RoutingLocaleSource = RoutingLocaleSignal | "default";

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
