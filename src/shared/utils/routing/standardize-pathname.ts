import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { PREFIX_PLACEHOLDER } from "@/shared/constants/prefix-placeholder";
import { normalizePathname } from "@/shared/utils/normalize-pathname";

interface StandardizePathnameOptions {
  config: IntorResolvedConfig;
  pathname: string;
}

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
export const standardizePathname = ({
  config,
  pathname,
}: StandardizePathnameOptions): string => {
  const { routing } = config;
  const { basePath } = routing;

  // Normalize each segment before join to avoid redundant slashes
  const parts = [
    normalizePathname(basePath),
    PREFIX_PLACEHOLDER,
    normalizePathname(pathname),
  ];

  // Avoid double slashes between segments
  const standardizedPathname = parts.join("/").replaceAll(/\/{2,}/g, "/");

  // Final normalization to ensure leading slash, no trailing
  return normalizePathname(standardizedPathname);
};
