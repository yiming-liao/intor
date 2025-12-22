/**
 * Locale resolution sources used by routing and config.
 *
 * - Represents resolved data sources, not detection strategies.
 */
export type RoutingLocaleSource =
  | "path"
  | "host"
  | "query"
  | "cookie"
  | "detected";
