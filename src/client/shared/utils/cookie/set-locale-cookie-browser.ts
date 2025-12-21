import type { CookieResolvedOptions } from "@/config/types/cookie.types";
import { buildCookieString } from "./build-cookie-string";

/**
 * Sets a locale cookie on the browser only.
 */
export const setLocaleCookieBrowser = (
  cookie: CookieResolvedOptions,
  locale: string,
): void => {
  if (typeof document === "undefined") return;

  // Skip if cookie setting is disabled or auto-set is turned off
  if (!cookie.enabled || !cookie.persist) return;

  // Build the cookie string using provided options
  const cookieString = buildCookieString(cookie, locale);

  // Set the cookie on the document
  document.cookie = cookieString;
};
