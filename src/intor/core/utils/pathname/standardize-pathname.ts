import type { IntorResolvedConfig } from "../../../core/intor-config/types/define-intor-config-types";
import type {
  RawPathname,
  StandardizePathname,
} from "../../../types/pathname-types";
import { normalizePathname } from "../../../core/utils/pathname/normalize-pathname";

type StandardizePathnameOptions = {
  config: IntorResolvedConfig;
  pathname: RawPathname;
};

/**
 * Standardize a pathname by prepending the base path and prefix placeholder,
 * then normalize the result to remove redundant slashes.
 *
 * @example
 * basePath: "/asd/qwe"
 * prefixPlaceHolder: "{{locale}}"
 * pathname: "/cms"
 * => Result: "/asd/qwe/{{locale}}/cms"
 *
 * @param options - Object containing config and pathname to standardize
 * @returns The standardized pathname
 */
export const standardizePathname = ({
  config,
  pathname,
}: StandardizePathnameOptions): StandardizePathname => {
  const { routing, prefixPlaceHolder } = config;
  const { basePath } = routing;

  // Normalize each segment before join to avoid redundant slashes
  const parts = [
    normalizePathname(basePath),
    normalizePathname(prefixPlaceHolder),
    normalizePathname(pathname),
  ];

  // Avoid double slashes between segments
  const standardizedPathname = parts.join("/").replace(/\/{2,}/g, "/");

  // Final normalization to ensure leading slash, no trailing
  return normalizePathname(standardizedPathname);
};
