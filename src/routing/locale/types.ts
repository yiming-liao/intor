import type { RoutingLocaleSource } from "@/shared/types/routing";

/** Context for locale resolution. */
export interface LocaleContext {
  /** Locale extracted from the URL pathname, if present */
  path?: { locale?: string };
  /** Locale inferred from the request host, if applicable */
  host?: { locale?: string };
  /** Locale provided via query parameters, if applicable */
  query?: { locale?: string };
  /** Locale read from cookies, if present */
  cookie?: { locale?: string };
  /**
   * Fallback locale determined by the system.
   *
   * - This value is always available and represents the
   * final fallback when no other source matches.
   */
  detected: { locale: string };
}

/** Final resolved locale. */
export interface ResolvedLocale {
  /** Resolved locale identifier */
  locale: string;
  /** Source from which the locale was resolved */
  source: RoutingLocaleSource;
}
