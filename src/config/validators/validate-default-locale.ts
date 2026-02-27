import type { Locale } from "intor-translator";
import { IntorError, INTOR_ERROR_CODE } from "../../core";

/**
 * Validates that the configured defaultLocale is supported.
 *
 * Fails fast if `defaultLocale` is not included in `supportedLocales`.
 */
export const validateDefaultLocale = (
  id: string,
  defaultLocale: Locale,
  supportedSet: ReadonlySet<Locale>,
): Locale => {
  if (!supportedSet.has(defaultLocale)) {
    throw new IntorError({
      id,
      code: INTOR_ERROR_CODE.CONFIG_UNSUPPORTED_DEFAULT_LOCALE,
      message: `"defaultLocale" must be included in "supportedLocales".`,
    });
  }

  return defaultLocale;
};
