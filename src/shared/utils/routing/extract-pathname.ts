import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { normalizePathname } from "../normalize-pathname";

interface ExtractPathnameOptions {
  config: IntorResolvedConfig;
  pathname: string;
}

interface ExtractPathnameResult {
  basePath: string;
  prefixedPathname: string;
  unprefixedPathname: string;
  maybeLocale: string | undefined;
  isLocalePrefixed: boolean;
}

/**
 * Extracts basePath and locale info from a raw pathname,
 * producing a canonical, locale-agnostic result.
 *
 * @example
 * ```ts
 * // config.supportedLocales: ["en-US"]
 * // config.routing.basePath: "/app"
 * // config.routing.prefix: "all"
 * extractPathname({ config, pathname: "/app/en-US/about" });
 * // => {
 * //   basePath: "/app",
 * //   prefixedPathname: "/en-US/about",
 * //   unprefixedPathname: "/about",
 * //   maybeLocale: "en-US",
 * //   isLocalePrefixed: true
 * // }
 *```
 */
export const extractPathname = ({
  config,
  pathname: rawPathname,
}: ExtractPathnameOptions): ExtractPathnameResult => {
  const { routing } = config;
  const { basePath } = routing;

  const normalizedPathname = normalizePathname(rawPathname);

  // Remove basePath
  let prefixedPathname = normalizedPathname;
  if (normalizedPathname === basePath) {
    prefixedPathname = "/";
  }
  if (normalizedPathname.startsWith(basePath + "/")) {
    prefixedPathname = normalizedPathname.slice(basePath.length);
  }

  // Detect locale
  const firstSegment = prefixedPathname.split("/").find(Boolean);
  const maybeLocale = firstSegment;
  const isLocalePrefixed = Boolean(
    maybeLocale && config.supportedLocales.includes(maybeLocale),
  );

  // Canonical strip: always remove locale
  const unprefixedPathname =
    isLocalePrefixed && maybeLocale
      ? prefixedPathname.slice(maybeLocale.length + 1) || "/"
      : prefixedPathname;

  return {
    basePath,
    prefixedPathname,
    unprefixedPathname,
    maybeLocale,
    isLocalePrefixed,
  };
};
