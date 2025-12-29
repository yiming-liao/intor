import type { IntorResolvedConfig } from "@/config";
import { normalizeLocale } from "@/core";
import { detectBrowserLocale, getLocaleCookieBrowser } from "../utils";

/**
 * Resolve the locale in a client-only environment.
 *
 * This helper is intended for pure CSR setups (e.g. Vite).
 *
 * For framework-based apps, prefer `useTranslator()`.
 *
 * - Client-side only
 */
export function getClientLocale(config: IntorResolvedConfig): string {
  const { defaultLocale, supportedLocales, cookie } = config;

  // Locale from browser cookie
  const cookieLocale = getLocaleCookieBrowser(cookie.name);

  // Locale from browser preference
  const browserLocale = detectBrowserLocale();

  const localeCandidate = cookieLocale || browserLocale;

  return normalizeLocale(localeCandidate, supportedLocales) || defaultLocale;
}
