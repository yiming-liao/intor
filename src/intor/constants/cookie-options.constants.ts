import type { ResolvedCookieOptions } from "@/intor/core/intor-config/types/cookie-options.types";

// Default cookie options
export const DEFAULT_COOKIE_OPTIONS: ResolvedCookieOptions = {
  disabled: false,
  autoSetCookie: true,
  name: "intor.i18n.locale",
  domain: null,
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 365 days
  httpOnly: false,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "lax",
};
