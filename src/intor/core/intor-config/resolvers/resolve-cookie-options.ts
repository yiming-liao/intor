import type {
  InitCookieOptions,
  ResolvedCookieOptions,
} from "@/intor/core/intor-config/types/cookie-options.types";
import { DEFAULT_COOKIE_OPTIONS } from "@/intor/constants/cookie-options.constants";
import { EMPTY_OBJECT } from "@/intor/constants/shared.constants";

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
  cookie: InitCookieOptions = EMPTY_OBJECT,
): ResolvedCookieOptions => {
  return {
    ...DEFAULT_COOKIE_OPTIONS,
    ...cookie,
  };
};
