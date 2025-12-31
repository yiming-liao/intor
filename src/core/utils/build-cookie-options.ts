import type { CookieResolvedOptions } from "@/config";

export function buildCookieOptions(cookie: CookieResolvedOptions) {
  return {
    maxAge: cookie.maxAge,
    path: cookie.path,
    domain: cookie.domain,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
  };
}
