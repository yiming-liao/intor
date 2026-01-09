import type { IntorResolvedConfig } from "@/config";
import { canonicalizePathname } from "./canonicalize-pathname";
import { materializePathname } from "./materialize-pathname";
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
   * ```ts
   * // e.g. pathname: "/app/en-US/about"
   * ```
   */
  pathname: string;
  /**
   * Pathname with routing-specific prefixes removed.
   * ```ts
   * // e.g. unprefixedPathname: "/about"
   * ```
   */
  unprefixedPathname: string;
  /**
   * Pathname template with a locale placeholder.
   * ```ts
   * // e.g. templatedPathname: "/app/{locale}/about"
   * ```
   */
  templatedPathname: string;
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
 * localizePathname(config, "/app/en-US/about", "en-US");
 * // => {
 * //   pathname: '/app/en-US/about'
 * //   unprefixedPathname: '/about',
 * //   templatedPathname: '/app/{locale}/about',
 * // }
 * ```
 */
export const localizePathname = (
  rawPathname: string,
  config: IntorResolvedConfig,
  locale?: string,
): LocalizedPathname => {
  // 1. Canonicalize: normalize and remove routing-specific prefixes
  const canonicalized = canonicalizePathname(rawPathname, config);

  // 2. Standardize: convert to internal pathname shape with locale placeholder
  const standardized = standardizePathname(canonicalized, config);

  // 3. Materialize: apply routing rules to produce the final pathname
  const materialized = materializePathname(standardized, config, locale);

  return {
    pathname: materialized,
    unprefixedPathname: canonicalized,
    templatedPathname: standardized,
  };
};
