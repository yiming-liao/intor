import type { CookieResolvedOptions } from "../types";

// Default cookie options
export const DEFAULT_COOKIE_OPTIONS: CookieResolvedOptions = {
  persist: true,
  name: "intor.locale",
  domain: undefined,
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 365 days
  httpOnly: false,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "lax",
};
