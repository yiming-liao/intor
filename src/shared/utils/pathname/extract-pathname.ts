import type { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { normalizePathname } from "./normalize-pathname";

interface ExtractPathnameOptions {
  config: IntorResolvedConfig;
  pathname: string;
}

interface ExtractPathnameResult {
  basePath: string;
  prefixedPathname: string;
  unprefixedPathname: string;
  maybeLocale: string;
  isLocalePrefixed: boolean;
}

/**
 * Extracts basePath and locale info from a raw pathname.
 *
 * ```ts
 * extractPathname({ config, pathname: '/app/en/about' });
 * => {
 *   basePath: '/app',
 *   prefixedPathname: '/en/about',
 *   unprefixedPathname: '/about',
 *   maybeLocale: 'en',
 *   isLocalePrefixed: true
 * }
 * ```
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
  const pathPart = prefixedPathname.split("/").find(Boolean);
  const maybeLocale = pathPart || "";
  const isLocalePrefixed = config.supportedLocales?.includes(maybeLocale); // Check by supportedLocales

  // prefix: "none"
  let unprefixedPathname: string = prefixedPathname;

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
