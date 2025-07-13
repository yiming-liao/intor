import type { NextRequest, NextResponse } from "next/server";
import { ResolvedCookieOptions } from "@/modules/intor-config/types/cookie-options-types";

type SetLocaleCookieParams = {
  request: NextRequest;
  response: NextResponse;
  cookie: ResolvedCookieOptions;
  locale: string;
  override?: boolean;
};

/**
 * Set a locale cookie on the response.
 * - For Next.js edge middleware.
 * - Defaults to not overriding existing cookies.
 */
export function setLocaleCookieEdge({
  request,
  response,
  cookie,
  locale,
  override = false, // Default to not override existed cookie
}: SetLocaleCookieParams) {
  // Cookie disabled from defined config
  if (cookie.disabled || !cookie.autoSetCookie) {
    return;
  }

  const isCookieExists = request.cookies.has(cookie.name);

  // Cookie already exists and cannot override
  if (isCookieExists && !override) {
    return;
  }

  // Set cookie to response
  response.cookies.set(cookie.name, locale, {
    maxAge: cookie.maxAge,
    path: cookie.path,
    ...(cookie.domain ? { domain: cookie.domain } : {}),
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
  });
}
