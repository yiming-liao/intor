import type { IntorResolvedConfig } from "../../config";
import { normalizePathname } from "../../core";

/**
 * Get locale from pathname.
 *
 * Extracts the first pathname segment (after basePath) as a locale
 * if it exactly matches one of the supported locales.
 *
 * @example
 * ```ts
 * getLocaleFromPathname(config, "/en/about")
 * // => "en"
 * getLocaleFromPathname(config, "/zh-TW")
 * // => "zh-TW"
 * getLocaleFromPathname(config, "/about")
 * // => undefined
 *
 * // config.routing.basePath: "/app"
 * getLocaleFromPathname(config, "/app/en/dashboard")
 * // => "en"
 * ```
 */
export function getLocaleFromPathname(
  pathname: string,
  config: IntorResolvedConfig,
): string | undefined {
  const { routing, supportedLocales } = config;
  const { basePath } = routing;

  // 1. Normalize pathname
  const normalizedPathname = normalizePathname(pathname);

  // 2. Strip basePath
  let prefixedPathname = normalizedPathname;
  if (basePath && normalizedPathname === basePath) {
    prefixedPathname = "/";
  } else if (basePath && normalizedPathname.startsWith(basePath + "/")) {
    prefixedPathname = normalizedPathname.slice(basePath.length);
  }

  // 3. Detect locale segment
  const firstSegment = prefixedPathname.split("/").find(Boolean);

  return firstSegment && supportedLocales.includes(firstSegment)
    ? firstSegment
    : undefined;
}
