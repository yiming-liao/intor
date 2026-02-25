import type { RoutingLocaleSource } from "../../../core";
import type { Locale } from "intor-translator";

/** Context for locale resolution. */
export interface LocaleContext {
  path?: { locale?: Locale };
  host?: { locale?: Locale };
  query?: { locale?: Locale };
  cookie?: { locale?: Locale };
  /**
   * Fallback locale determined by the system.
   *
   * - This value is always available and represents the
   * final fallback when no other source matches.
   */
  detected: { locale: Locale };
}

/** Final resolved locale. */
export interface ResolvedLocale {
  /** Resolved locale identifier */
  locale: Locale;
  /** Source from which the locale was resolved */
  localeSource: RoutingLocaleSource;
}
