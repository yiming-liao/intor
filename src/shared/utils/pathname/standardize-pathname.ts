import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { PREFIX_PLACEHOLDER } from "@/shared/constants/prefix-placeholder";
import { normalizePathname } from "@/shared/utils";

interface StandardizePathnameOptions {
  config: IntorResolvedConfig;
  pathname: string;
}

/**
 * Standardize a pathname by prepending the base path and prefix placeholder,
 * then normalize the result to remove redundant slashes.
 *
 * ```ts
 * standardizePathname({ config, pathname: "/cms" });
 * // basePath: "/asd/qwe"
 * // prefixPlaceHolder: "{locale}"
 * => "/asd/qwe/{locale}/cms"
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
