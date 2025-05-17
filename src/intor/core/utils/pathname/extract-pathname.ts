import type { IntorResolvedConfig } from "../../../core/intor-config/types/define-intor-config-types";
import type {
  BasePath,
  PrefixedPathname,
  RawPathname,
  UnprefixedPathname,
} from "../../../types/pathname-types";
import { normalizePathname } from "../../../core/utils/pathname/normalize-pathname";

type ExtractPathnameOptions = {
  config: IntorResolvedConfig;
  pathname: RawPathname;
};

export type ExtractPathnameResult = {
  basePath: BasePath;
  prefixedPathname: PrefixedPathname;
  unprefixedPathname: UnprefixedPathname;
  maybeLocale: string;
  isLocalePrefixed: boolean;
};

/**
 * Extracts basePath and locale info from a raw pathname.
 *
 * @param options.config - App config (with basePath, prefix, locales)
 * @param options.pathname - Raw input pathname (e.g., '/app/en/about')
 * @returns Result with basePath, prefixed/unprefixed path, maybeLocale, and locale flag
 *
 * @example
 * extractPathname({ config, pathname: '/app/en/about' });
 * // Result => {
 * //   basePath: '/app',
 * //   prefixedPathname: '/en/about',
 * //   unprefixedPathname: '/about',
 * //   maybeLocale: 'en',
 * //   isLocalePrefixed: true
 * // }
 */
export const extractPathname = ({
  config,
  pathname: rawPathname,
}: ExtractPathnameOptions): ExtractPathnameResult => {
  const { routing, defaultLocale } = config;
  const { basePath, prefix } = routing;
  const normalizedPathname = normalizePathname(rawPathname);

  let prefixedPathname: PrefixedPathname = normalizedPathname;

  // Remove basePath if exists
  if (basePath && normalizedPathname.startsWith(basePath + "/")) {
    prefixedPathname = normalizedPathname.slice(basePath.length) || "/";
  } else if (basePath && normalizedPathname === basePath) {
    prefixedPathname = "/";
  }

  // Extract potential locale from pathname
  const pathParts = prefixedPathname.split("/").filter(Boolean);
  const maybeLocale = pathParts[0] || "";
  const isLocalePrefixed = config.supportedLocales?.includes(maybeLocale); // Check by supportedLocales

  // prefix: "none"
  let unprefixedPathname: UnprefixedPathname = prefixedPathname;

  // prefix: "all"
  if (prefix === "all") {
    if (isLocalePrefixed) {
      unprefixedPathname =
        prefixedPathname.slice(maybeLocale.length + 1) || "/";
    }
  }
  // prefix: "except-default",
  else if (prefix === "except-default") {
    if (maybeLocale && maybeLocale !== defaultLocale && isLocalePrefixed) {
      unprefixedPathname =
        prefixedPathname.slice(maybeLocale.length + 1) || "/";
    }
  }

  return {
    basePath,
    prefixedPathname,
    unprefixedPathname,
    maybeLocale,
    isLocalePrefixed: Boolean(isLocalePrefixed),
  };
};
