import type { RoutingLocaleSource } from "../../../core";
import type { Locale } from "intor-translator";

/** Context for locale resolution. */
export interface LocaleContext {
  path?: { locale?: Locale };
  host?: { locale?: Locale };
  query?: { locale?: Locale };
  cookie?: { locale?: Locale };
  detected?: { locale: Locale };
}

/** Final resolved locale. */
export interface ResolvedLocale {
  /** Resolved locale identifier */
  locale: Locale;
  /** Source from which the locale was resolved */
  localeSource: RoutingLocaleSource;
}
