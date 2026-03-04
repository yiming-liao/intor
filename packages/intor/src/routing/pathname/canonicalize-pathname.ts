import type { IntorResolvedConfig } from "../../config";
import { normalizePathname, LOCALE_PLACEHOLDER } from "../../core";

/**
 * Returns the internal canonical pathname.
 *
 * Canonical representation is the locale-neutral and deployment-neutral
 * internal routing form used for identity and routing computation.
 *
 * Guarantees:
 * - Pathname is normalized
 * - Deployment prefix (`basePath`) is removed
 * - Leading locale segment or `{locale}` placeholder is removed
 * - Only the first path segment is evaluated for locale stripping
 * - Result always starts with "/"
 * - Root is represented as "/"
 *
 * Accepts `{locale}` as a locale placeholder segment.
 *
 * @example
 * ```ts
 * // config.supportedLocales: ["en"]
 * // config.routing.basePath: "/app"
 * // config.routing.prefix: "all"
 * canonicalizePathname("/app/en/about", config);
 * // => "/about"
 *```
 */
export function canonicalizePathname(
  rawPathname: string,
  config: IntorResolvedConfig,
): string {
  const { routing, supportedLocales } = config;
  const normalizedPathname = normalizePathname(rawPathname);

  // ---------------------------------------------------------------------------
  // Strip basePath (deployment prefix)
  // ---------------------------------------------------------------------------
  const basePath = routing.basePath === "/" ? "" : routing.basePath;

  let path = normalizedPathname;

  if (basePath) {
    if (path === basePath) {
      path = "/";
    } else if (path.startsWith(basePath + "/")) {
      path = path.slice(basePath.length);
    }
  }

  // ---------------------------------------------------------------------------
  // Detect first segment (allocation-minimized)
  // ---------------------------------------------------------------------------
  if (path === "/") return "/";

  const segmentStart = 1; // skip leading "/"
  const nextSlash = path.indexOf("/", segmentStart);

  const firstSegment =
    nextSlash === -1
      ? path.slice(segmentStart)
      : path.slice(segmentStart, nextSlash);

  // ---------------------------------------------------------------------------
  // Determine if first segment is locale representation
  // ---------------------------------------------------------------------------
  let localeLength: number | undefined;

  if (firstSegment === LOCALE_PLACEHOLDER) {
    localeLength = firstSegment.length;
  } else if (supportedLocales.includes(firstSegment)) {
    localeLength = firstSegment.length;
  }

  // ---------------------------------------------------------------------------
  // Strip locale segment (if any)
  // ---------------------------------------------------------------------------
  if (localeLength !== undefined) {
    const stripped = path.slice(localeLength + 1);
    return stripped || "/";
  }

  return path;
}
