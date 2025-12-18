import type { IntorResolvedConfig } from "@/config";

/**
 * Get the initial locale from cookie, browser, or default.
 *
 * - This function is intended for client-side use only.
 *
 * @param {IntorResolvedConfig} config - The intor configuration.
 * @param {string} [cookieName=config.cookie.name] - Optional cookie name to check.
 * @returns {string} The matched locale or the default locale.
 */
export function getInitialLocale(
  config: IntorResolvedConfig,
  cookieName: string = config.cookie.name,
): string {
  const { defaultLocale, supportedLocales } = config;

  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${cookieName.replaceAll(/([.$?*|{}()[\]\\/+^])/g, String.raw`\$1`)}=([^;]*)`,
    ),
  );
  const cookieLocale = match ? decodeURIComponent(match[1]) : null;
  const browserLocale = navigator.languages?.[0] || navigator.language;

  const locale = cookieLocale || browserLocale || defaultLocale;

  const normalized = locale.toLowerCase();
  const matched = supportedLocales.find((l) => l.toLowerCase() === normalized);
  return matched ?? defaultLocale;
}
