import type { IntorResolvedConfig } from "@/config";
import { detectBrowserLocale } from "@/client/shared/utils/locale/detect-browser-locale";
import { getLocaleCookieBrowser } from "@/client/shared/utils/locale/get-locale-cookie-browser";
import { normalizeLocale } from "@/shared/utils";

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
