import type { CookieResolvedOptions } from "../types";

// Default cookie options
export const DEFAULT_COOKIE_OPTIONS: CookieResolvedOptions = {
  enabled: false,
  name: "intor.locale",
  domain: undefined,
  path: "/",
  maxAge: undefined,
  httpOnly: false,
  secure: process.env["NODE_ENV"] !== "development",
  sameSite: "lax",
};
