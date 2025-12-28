import type { IntorResolvedConfig } from "@/config";
import { PREFIX_PLACEHOLDER } from "../../constants";
import { normalizePathname } from "../normalizers";

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
