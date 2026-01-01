import type { IntorResolvedConfig } from "@/config";
import { getUnprefixedPathname } from "./get-unprefixed-pathname";
import { localePrefixPathname } from "./locale-prefix-pathname";
import { standardizePathname } from "./standardize-pathname";

/**
 * Represents a group of localized pathname forms.
 *
 * Contains pathname representations at different
 * stages of the localization pipeline.
 */
export interface LocalizedPathname {
  /**
   * Final, locale-resolved pathname ready for consumption.
   * @example
   * "/app/en-US/about"
   */
  pathname: string;
  /**
   * Pathname with locale prefix removed.
   * @example
   * "/about"
   */
  unprefixedPathname: string;
  /**
   * Canonical pathname with locale placeholder applied.
   * @example
   * "/app/{locale}/cms"
   */
  standardizedPathname: string;
}

/**
 * Localizes a pathname by composing canonicalization,
 * standardization, and locale prefix strategies.
 *
 * @example
 * ```ts
 * // config.supportedLocales: ["en-US"]
 * // config.routing.basePath: "/app"
 * // config.routing.prefix: "all"
 * localePrefixPathname({ config, pathname: "/app/en-US/about", locale: "en-US" });
 * // => {
 * //   unprefixedPathname: '/about',
 * //   standardizedPathname: '/app/{locale}/about',
 * //   localizedPathname: '/app/en-US/about'
 * // }
 * ```
 */
export const localizePathname = (
  config: IntorResolvedConfig,
  rawPathname: string,
  locale?: string,
): LocalizedPathname => {
  // 1. Canonicalize: extract basePath and strip locale
  const unprefixedPathname = getUnprefixedPathname(config, rawPathname);

  // 2. Standardize: build a pathname with locale placeholder
  const standardizedPathname = standardizePathname(config, unprefixedPathname);

  // 3. Apply strategy: resolve locale prefix based on routing rules
  const pathname = localePrefixPathname(config, standardizedPathname, locale);

  return {
    pathname,
    unprefixedPathname,
    standardizedPathname,
  };
};
