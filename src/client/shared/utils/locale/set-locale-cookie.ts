import type { CookieResolvedOptions } from "../../../../config";
import type { Locale } from "intor-translator";
import { buildCookieString } from "../build-cookie-string";

/**
 * Persist locale to a cookie.
 *
 * This function relies on `document.cookie`.
 */
export const setLocaleCookie = (
  cookieOptions: CookieResolvedOptions,
  locale: Locale,
): void => {
  if (typeof document === "undefined") return;

  // Build and apply the cookie string
  document.cookie = buildCookieString(cookieOptions, locale);
};
