import { localePrefixPathname } from "@/adapters/next-client/utils/locale-prefix-pathname";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";
import { extractPathname } from "@/shared/utils/pathname/extract-pathname";
import { standardizePathname } from "@/shared/utils/pathname/standardize-pathname";

type LocalizePathnameOptions = {
  config: IntorResolvedConfig;
  pathname: string;
  locale?: string;
};

/**
 * Localizes a given pathname by:
 * 1. Removing the basePath and locale prefix (if necessary) using `extractPathname`.
 * 2. Standardizing the pathname by appending basePath and the prefixPlaceholder using `standardizedPathname`.
 * 3. Adding the correct locale prefix back to the standardized pathname using `localePrefixPathname`.
 */
export const localizePathname = ({
  config,
  pathname: rawPathname,
  locale,
}: LocalizePathnameOptions): {
  unprefixedPathname: string;
  standardizedPathname: string;
  localePrefixedPathname: string;
} => {
  // Remove the locale prefix if necessary
  const { unprefixedPathname } = extractPathname({
    config,
    pathname: rawPathname,
  });

  // Standardize pathname
  const standardizedPathname = standardizePathname({
    config,
    pathname: unprefixedPathname,
  });

  // Add locale prefix to pathname
  const localePrefixedPathname = localePrefixPathname({
    config,
    pathname: standardizedPathname,
    locale,
  });

  return {
    unprefixedPathname,
    standardizedPathname,
    localePrefixedPathname,
  };
};
