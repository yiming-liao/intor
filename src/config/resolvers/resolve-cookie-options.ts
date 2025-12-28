import type { CookieRawOptions, CookieResolvedOptions } from "../types";
import { DEFAULT_COOKIE_OPTIONS } from "../constants";

export const resolveCookieOptions = (
  cookie: CookieRawOptions = {},
): CookieResolvedOptions => {
  return {
    ...DEFAULT_COOKIE_OPTIONS,
    ...cookie,
  };
};
