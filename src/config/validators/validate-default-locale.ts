import { IntorError, IntorErrorCode } from "@/core";

/**
 * Validates that the configured defaultLocale is supported.
 *
 * Fails fast if `defaultLocale` is not included in `supportedLocales`.
 */
export const validateDefaultLocale = (
  id: string,
  defaultLocale: string,
  supportedSet: ReadonlySet<string>,
): string => {
  if (!supportedSet.has(defaultLocale)) {
    throw new IntorError({
      id,
      code: IntorErrorCode.UNSUPPORTED_DEFAULT_LOCALE,
      message: `"defaultLocale" must be included in "supportedLocales".`,
    });
  }

  return defaultLocale;
};
