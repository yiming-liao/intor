import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import { extractPathname, standardizePathname } from "@/shared/utils";
import { localePrefixPathname } from "@/shared/utils/routing/locale-prefix-pathname";

interface LocalizePathnameOptions {
  config: IntorResolvedConfig;
  pathname: string;
  locale?: string;
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
export const localizePathname = ({
  config,
  pathname: rawPathname,
  locale,
}: LocalizePathnameOptions): {
  unprefixedPathname: string;
  standardizedPathname: string;
  localizedPathname: string;
} => {
  // 1. Canonicalize: extract basePath and strip locale
  const { unprefixedPathname } = extractPathname({
    config,
    pathname: rawPathname,
  });

  // 2. Standardize: build a pathname with locale placeholder
  const standardizedPathname = standardizePathname({
    config,
    pathname: unprefixedPathname,
  });

  // 3. Apply strategy: resolve locale prefix based on routing rules
  const localizedPathname = localePrefixPathname({
    config,
    pathname: standardizedPathname,
    locale,
  });

  return {
    unprefixedPathname,
    standardizedPathname,
    localizedPathname,
  };
};
