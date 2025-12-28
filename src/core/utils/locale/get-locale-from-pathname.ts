import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { normalizePathname } from "@/core/utils/normalizers/normalize-pathname";

/**
 * Extracts the locale from a pathname, if present.
 *
 * - Normalizes the raw pathname.
 * - Strips the configured basePath.
 * - Inspects the first path segment to determine whether
 *   it matches a supported locale.
 *
 * If no locale segment is found, `undefined` is returned.
 *
 * Note:
 * - The pathname is treated as a canonical source.
 * - Only exact matches against `supportedLocales` are accepted.
 * - ___Locale normalization is intentionally not applied here.___
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
  config: IntorResolvedConfig,
  pathname: string,
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
