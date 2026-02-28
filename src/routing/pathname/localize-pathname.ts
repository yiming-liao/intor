import type { IntorConfig } from "../../config";
import { canonicalizePathname } from "./canonicalize-pathname";
import { materializePathname } from "./materialize-pathname";
import { standardizePathname } from "./standardize-pathname";

/**
 * Represents a group of localized pathname forms.
 *
 * Contains pathname representations at different
 * stages of the localization pipeline.
 *
 * @public
 */
export interface LocalizedPathname {
  /**
   * Pathname with routing-specific prefixes removed.
   *
   * @example
   * ```ts
   * // e.g. canonicalPathname: "/about"
   * ```
   */
  canonicalPathname: string;
  /**
   * Pathname template with a locale placeholder.
   *
   * @example
   * ```ts
   * // e.g. templatedPathname: "/app/{locale}/about"
   * ```
   */
  templatedPathname: string;
  /**
   * Primary locale-aware pathname.
   *
   * This is the value most consumers should use.
   *
   * @example
   * ```ts
   * // e.g. pathname: "/app/en-US/about"
   * ```
   */
  pathname: string;
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
 * localizePathname("/app/en-US/about", config, "en-US");
 * // => {
 * //   pathname: '/app/en-US/about'
 * //   canonicalPathname: '/about',
 * //   templatedPathname: '/app/{locale}/about',
 * // }
 * ```
 *
 * @public
 */
export const localizePathname = (
  rawPathname: string,
  config: IntorConfig,
  locale: string,
): LocalizedPathname => {
  // 1. Canonicalize: normalize and remove routing-specific prefixes
  const canonicalPathname = canonicalizePathname(rawPathname, config);

  // 2. Standardize: convert to internal pathname shape with locale placeholder
  const standardizedPathname = standardizePathname(canonicalPathname, config);

  // 3. Materialize: apply routing rules to produce the final pathname
  const materializedPathname = materializePathname(
    standardizedPathname,
    config,
    locale,
  );

  return {
    canonicalPathname,
    templatedPathname: standardizedPathname,
    pathname: materializedPathname,
  };
};
