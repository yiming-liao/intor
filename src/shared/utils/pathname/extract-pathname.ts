import { normalizePathname } from "./normalize-pathname";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

type ExtractPathnameOptions = {
  config: IntorResolvedConfig;
  pathname: string;
};

export type ExtractPathnameResult = {
  basePath: string;
  prefixedPathname: string;
  unprefixedPathname: string;
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

  let prefixedPathname = normalizedPathname;

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

  // context: "none"
  let unprefixedPathname: string = prefixedPathname;

  // context: "all"
  if (prefix === "all") {
    if (isLocalePrefixed) {
      unprefixedPathname =
        prefixedPathname.slice(maybeLocale.length + 1) || "/";
    }
  }
  // context: "except-default",
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
