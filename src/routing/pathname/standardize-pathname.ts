import type { IntorResolvedConfig } from "../../config";
import { LOCALE_PLACEHOLDER } from "../../core";

/**
 * Standardizes a canonical pathname into an internal routing template.
 *
 * Standardized representation:
 * - Prepends the deployment prefix (`basePath`) if defined
 * - Injects the `{locale}` placeholder as the first path segment
 * - Preserves the canonical pathname structure
 *
 * Input must be a canonical pathname.
 *
 * Output is an internal routing template and
 * is not a locale-resolved URL.
 *
 * @example
 * ```ts
 * // config.routing.basePath: "/app",
 * standardizePathname("/about", config);
 * // => "/app/{locale}/about"
 * ```
 */
export const standardizePathname = (
  canonicalPathname: string,
  config: IntorResolvedConfig,
): string => {
  const { routing } = config;

  const basePath =
    routing.basePath && routing.basePath !== "/" ? routing.basePath : "";

  if (canonicalPathname === "/") {
    return basePath
      ? `${basePath}/${LOCALE_PLACEHOLDER}`
      : `/${LOCALE_PLACEHOLDER}`;
  }

  return basePath
    ? `${basePath}/${LOCALE_PLACEHOLDER}${canonicalPathname}`
    : `/${LOCALE_PLACEHOLDER}${canonicalPathname}`;
};
