import type { IntorResolvedConfig } from "@/config";
import { getLocaleCookieBrowser } from "@/client/shared/utils/cookie/get-locale-cookie-browser";
import { getBrowserLocale } from "@/client/shared/utils/get-browser-locale";

/**
 * Get the initial locale from cookie, browser, or default.
 *
 * - Client-side use only.
 */
export function getInitialLocale(config: IntorResolvedConfig): string {
  const { defaultLocale, supportedLocales, cookie } = config;

  // Read locale from cookie (if exists)
  const cookieLocale = getLocaleCookieBrowser(cookie);

  // Read browser-preferred locale
  const browserLocale = getBrowserLocale();

  // Determine the preferred locale candidate
  const localeCandidate = cookieLocale || browserLocale;

  // Normalize and match against supported locales
  let matched;
  if (localeCandidate) {
    const normalized = localeCandidate.toLowerCase();
    matched = supportedLocales.find((l) => l.toLowerCase() === normalized);
  }

  return matched ?? defaultLocale;
}
