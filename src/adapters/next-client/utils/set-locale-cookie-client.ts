import { buildCookieString } from "@/adapters/next-client/utils/build-cookie-string";
import { ResolvedCookieOptions } from "@/modules/intor-config/types/cookie-options-types";

type SetLocaleCookieOptions = {
  cookie: ResolvedCookieOptions;
  locale: string;
};

/**
 * Sets a locale cookie on the client-side only.
 *
 * This function ensures the cookie is not set during SSR,
 * and respects configuration flags such as `disabled` and `autoSetCookie`.
 *
 * @param cookie - Configuration for the cookie (name, path, expiration, etc.)
 * @param locale - The locale string to store in the cookie
 */
export const setLocaleCookieClient = ({
  cookie,
  locale,
}: SetLocaleCookieOptions): void => {
  // Skip if running on the server (SSR)
  if (typeof window === "undefined") {
    return;
  }

  // Skip if cookie setting is disabled or auto-set is turned off
  if (cookie.disabled || !cookie.autoSetCookie) {
    return;
  }

  // Build the cookie string using provided options
  const cookieString = buildCookieString(cookie, locale);

  // Set the cookie on the document
  document.cookie = cookieString;
};
