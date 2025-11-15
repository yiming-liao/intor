import type {
  CookieRawOptions,
  CookieResolvedOptions,
} from "@/modules/config/types/cookie.types";
import { DEFAULT_COOKIE_OPTIONS } from "@/modules/config/constants/cookie.constants";

/**
 * Resolves the final cookie options by merging the provided options with the default ones.
 *
 * This function accepts custom cookie options and merges them with the default values. If no custom options
 * are provided, the default options will be used. The function returns the resolved cookie options.
 *
 * @param cookie - The custom cookie options to override the defaults (optional).
 * @returns The resolved cookie options, merging the defaults and the provided options.
 */
export const resolveCookieOptions = (
  cookie: CookieRawOptions = {},
): CookieResolvedOptions => {
  return {
    ...DEFAULT_COOKIE_OPTIONS,
    ...cookie,
  };
};
