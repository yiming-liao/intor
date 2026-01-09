import type { IntorResolvedConfig } from "@/config";
import { normalizePathname, PREFIX_PLACEHOLDER } from "@/core";

/**
 * Standardizes a canonical pathname into an internal routing template
 * by applying the base path and injecting a locale placeholder.
 *
 * @example
 * ```ts
 * // config.routing.basePath: "/app",
 * // config.routing.prefix: "all"
 * standardizePathname("/about", config);
 * // => "/app/{locale}/about"
 * ```
 */
export const standardizePathname = (
  canonicalizedPathname: string,
  config: IntorResolvedConfig,
): string => {
  const { basePath } = config.routing;

  // Normalize each segment before join to avoid redundant slashes
  const parts = [
    normalizePathname(basePath),
    PREFIX_PLACEHOLDER,
    normalizePathname(canonicalizedPathname),
  ];

  // Avoid double slashes between segments
  const standardizedPathname = parts.join("/").replaceAll(/\/{2,}/g, "/");

  // Final normalization to ensure leading slash, no trailing
  return normalizePathname(standardizedPathname);
};
