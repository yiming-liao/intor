import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { PREFIX_PLACEHOLDER } from "@/core/constants/prefix-placeholder";
import { normalizePathname } from "@/core/utils/normalizers/normalize-pathname";

/**
 * Standardizes a canonical pathname by applying the base path
 * and injecting the locale placeholder.
 *
 * @example
 * ```ts
 * // routing.basePath: "/app",
 * standardizePathname({ config, pathname: "/cms" });
 * // => "/app/{locale}/cms"
 * ```
 */
export const standardizePathname = (
  config: IntorResolvedConfig,
  unprefixedPathname: string,
): string => {
  const { routing } = config;
  const { basePath } = routing;

  // Normalize each segment before join to avoid redundant slashes
  const parts = [
    normalizePathname(basePath),
    PREFIX_PLACEHOLDER,
    normalizePathname(unprefixedPathname),
  ];

  // Avoid double slashes between segments
  const standardizedPathname = parts.join("/").replaceAll(/\/{2,}/g, "/");

  // Final normalization to ensure leading slash, no trailing
  return normalizePathname(standardizedPathname);
};
