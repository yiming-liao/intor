import type { IntorResolvedConfig } from "../../../core/intor-config/types/define-intor-config-types";
import type {
  LocalizedPathname,
  RawPathname,
  StandardizePathname,
  UnprefixedPathname,
} from "../../../types/pathname-types";
import { extractPathname } from "../../../core/utils/pathname/extract-pathname";
import { localePrefixPathname } from "../../../core/utils/pathname/locale-prefix-pathname";
import { standardizePathname } from "../../../core/utils/pathname/standardize-pathname";

type LocalizePathnameOptions = {
  config: IntorResolvedConfig;
  pathname: RawPathname;
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
  unprefixedPathname: UnprefixedPathname;
  standardizedPathname: StandardizePathname;
  localePrefixedPathname: LocalizedPathname;
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
