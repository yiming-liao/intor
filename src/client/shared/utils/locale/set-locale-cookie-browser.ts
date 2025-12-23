import type { CookieResolvedOptions } from "@/config/types/cookie.types";
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

  // Skip when cookie persistence is disabled
  if (!cookieOptions.enabled || !cookieOptions.persist) return;

  // Build and apply the cookie string
  document.cookie = buildCookieString(cookieOptions, locale);
};
