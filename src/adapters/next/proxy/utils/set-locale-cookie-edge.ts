import type { CookieResolvedOptions } from "@/config/types/cookie.types";
import type { NextResponse } from "next/server";

interface SetLocaleCookieParams {
  response: NextResponse;
  cookie: CookieResolvedOptions;
  locale: string;
}

/**
 * Set a locale cookie on the response.
 * - For Next.js proxy.
 */
export function setLocaleCookieEdge({
  response,
  cookie,
  locale,
}: SetLocaleCookieParams) {
  if (!cookie.enabled || !cookie.persist) return;

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
