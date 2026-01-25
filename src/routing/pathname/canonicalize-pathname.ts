import type { IntorResolvedConfig } from "@/config";
import { normalizePathname, PREFIX_PLACEHOLDER } from "@/core";

/**
 * Returns a canonical, locale-agnostic pathname.
 *
 * Accepts `{locale}` as a locale placeholder segment.
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
  const normalizedPathname = normalizePathname(rawPathname);

  // Strip basePath
  let prefixedPathname = normalizedPathname;
  if (basePath && normalizedPathname === basePath) {
    prefixedPathname = "/";
  } else if (basePath && normalizedPathname.startsWith(basePath + "/")) {
    prefixedPathname = normalizedPathname.slice(basePath.length);
  }

  // Detect locale segment
  const firstSegment = prefixedPathname.split("/").find(Boolean);
  const locale =
    firstSegment === PREFIX_PLACEHOLDER
      ? PREFIX_PLACEHOLDER
      : firstSegment && supportedLocales.includes(firstSegment)
        ? firstSegment
        : undefined;

  // Strip locale segment
  return locale
    ? prefixedPathname.slice(locale.length + 1) || "/"
    : prefixedPathname;
}
