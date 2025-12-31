import type { CookieResolvedOptions } from "@/config";
import { buildCookieString } from "../build-cookie-string";

/**
 * Persist locale to browser cookie.
 *
 * - Client-side only
 */
export const setLocaleCookieBrowser = (
  cookieOptions: CookieResolvedOptions,
  locale: string,
): void => {
  if (typeof document === "undefined") return;

  // Build and apply the cookie string
  document.cookie = buildCookieString(cookieOptions, locale);
};
