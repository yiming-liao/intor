import type { IntorResolvedConfig } from "@/config";
import { normalizeLocale, type GenConfigKeys, type GenLocale } from "@/core";
import { detectBrowserLocale, getLocaleFromCookie } from "../utils";

/**
 * Resolve the active locale in a pure client-side environment.
 */
export function getClientLocale<CK extends GenConfigKeys = "__default__">(
  config: IntorResolvedConfig,
): GenLocale<CK> {
  const { defaultLocale, supportedLocales, cookie } = config;

  // Locale from browser cookie
  const cookieLocale = getLocaleFromCookie(cookie.name);

  // Locale from browser preference
  const browserLocale = detectBrowserLocale();

  const localeCandidate = cookieLocale || browserLocale;

  return normalizeLocale(localeCandidate, supportedLocales) || defaultLocale;
}
