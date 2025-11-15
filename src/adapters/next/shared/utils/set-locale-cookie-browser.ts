import type { CookieResolvedOptions } from "@/modules/config/types/cookie.types";
import { buildCookieString } from "@/adapters/next/shared/utils/build-cookie-string";

interface SetLocaleCookieBrowserOptions {
  cookie: CookieResolvedOptions;
  locale: string;
}

/**
 * Sets a locale cookie on the browser only.
 *
 * This function ensures the cookie is not set during SSR,
 * and respects configuration flags such as `disabled` and `autoSetCookie`.
 */
export const setLocaleCookieBrowser = ({
  cookie,
  locale,
}: SetLocaleCookieBrowserOptions): void => {
  // Skip if running on the server (SSR)
  if (globalThis.window === undefined) return;

  // Skip if cookie setting is disabled or auto-set is turned off
  if (cookie.disabled || !cookie.autoSetCookie) return;

  // Build the cookie string using provided options
  const cookieString = buildCookieString(cookie, locale);

  // Set the cookie on the document
  document.cookie = cookieString;
};
