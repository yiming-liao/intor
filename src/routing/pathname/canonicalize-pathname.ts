import type { IntorResolvedConfig } from "@/config";
import { normalizePathname } from "@/core";

/**
 * Returns a canonical, locale-agnostic pathname.
 *
 * @example
 * ```ts
 * // config.supportedLocales: ["en-US"]
 * // config.routing.basePath: "/app"
 * // config.routing.prefix: "all"
 * canonicalizePathname("/app/en-US/about", config);
 * // => "/about"
 *```
 */
export function canonicalizePathname(
  rawPathname: string,
  config: IntorResolvedConfig,
): string {
  const { routing, supportedLocales } = config;
  const { basePath } = routing;

  // 1. Normalize pathname
  const normalizedPathname = normalizePathname(rawPathname);

  // 2. Strip basePath
  let prefixedPathname = normalizedPathname;
  if (basePath && normalizedPathname === basePath) {
    prefixedPathname = "/";
  } else if (basePath && normalizedPathname.startsWith(basePath + "/")) {
    prefixedPathname = normalizedPathname.slice(basePath.length);
  }

  // 3. Detect locale segment
  const firstSegment = prefixedPathname.split("/").find(Boolean);
  const locale =
    firstSegment && supportedLocales.includes(firstSegment)
      ? firstSegment
      : undefined;

  // 4. Strip locale segment
  return locale
    ? prefixedPathname.slice(locale.length + 1) || "/"
    : prefixedPathname;
}
