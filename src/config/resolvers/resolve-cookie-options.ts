import type {
  CookieRawOptions,
  CookieResolvedOptions,
} from "@/config/types/cookie.types";
import { DEFAULT_COOKIE_OPTIONS } from "@/config/constants/cookie.constants";

export const resolveCookieOptions = (
  cookie: CookieRawOptions = {},
): CookieResolvedOptions => {
  return {
    ...DEFAULT_COOKIE_OPTIONS,
    ...cookie,
  };
};
