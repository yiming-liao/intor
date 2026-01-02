import type { RoutingLocaleSource } from "@/core";

/** Context for locale resolution. */
export interface LocaleContext {
  path?: { locale?: string };
  host?: { locale?: string };
  query?: { locale?: string };
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
  localeSource: RoutingLocaleSource;
}
