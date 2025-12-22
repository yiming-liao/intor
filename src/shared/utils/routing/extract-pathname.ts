import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { normalizePathname } from "../normalize-pathname";

interface ExtractPathnameOptions {
  config: IntorResolvedConfig;
  pathname: string;
}

interface ExtractPathnameResult {
  unprefixedPathname: string;
  locale: string | undefined;
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
 * //   unprefixedPathname: "/about",
 * //   locale: "en-US",
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
  const locale =
    firstSegment && config.supportedLocales.includes(firstSegment)
      ? firstSegment
      : undefined;

  // Canonical strip: always remove locale
  const unprefixedPathname = locale
    ? prefixedPathname.slice(locale.length + 1) || "/"
    : prefixedPathname;

  return {
    unprefixedPathname,
    locale,
  };
};
