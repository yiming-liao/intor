import type { IntorConfig } from "../../../config";
import { matchLocale, type GenConfigKeys, type GenLocale } from "../../../core";
import { detectBrowserLocale, getLocaleFromCookie } from "../utils";

/**
 * Resolve the active locale in a browser-only environment.
 *
 * This helper is intended for pure client-side setups where
 * no server-side locale resolution is involved.
 *
 * Resolution order:
 * 1. Locale from cookie
 * 2. Locale from browser preference
 * 3. Fallback to `defaultLocale`
 *
 * @public
 */
export function getClientLocale<CK extends GenConfigKeys = "__default__">(
  config: IntorConfig,
): GenLocale<CK> {
  const { defaultLocale, supportedLocales, cookie } = config;

  // Locale from browser cookie
  const cookieLocale = getLocaleFromCookie(cookie.name);

  // Locale from browser preference
  const browserLocale = detectBrowserLocale();

  const localeCandidate = cookieLocale || browserLocale;

  return matchLocale(localeCandidate, supportedLocales) || defaultLocale;
}
