import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { getUnprefixedPathname } from "@/shared/utils/pathname/get-unprefixed-pathname";
import { localePrefixPathname } from "@/shared/utils/pathname/locale-prefix-pathname";
import { standardizePathname } from "@/shared/utils/pathname/standardize-pathname";

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
): {
  unprefixedPathname: string;
  standardizedPathname: string;
  localizedPathname: string;
} => {
  // 1. Canonicalize: extract basePath and strip locale
  const unprefixedPathname = getUnprefixedPathname(config, rawPathname);

  // 2. Standardize: build a pathname with locale placeholder
  const standardizedPathname = standardizePathname(config, unprefixedPathname);

  // 3. Apply strategy: resolve locale prefix based on routing rules
  const localizedPathname = localePrefixPathname(
    config,
    standardizedPathname,
    locale,
  );

  return {
    unprefixedPathname,
    standardizedPathname,
    localizedPathname,
  };
};
