import type { IntorRawConfig } from "@/config";
import type { Locale } from "intor-translator";
import { IntorError, IntorErrorCode } from "@/core";

/**
 * Validates the configured default locale.
 *
 * - Ensures that `defaultLocale` is explicitly defined.
 * - Ensures that `defaultLocale` is included in `supportedLocales`.
 *
 * This validation is part of the configuration initialization phase
 * and is expected to fail fast when misconfigured.
 */
export const validateDefaultLocale = (
  config: IntorRawConfig,
  supportedLocales: readonly Locale[],
): string => {
  const { id, defaultLocale } = config;

  // Throw error if defaultLocale is undefined
  if (!defaultLocale) {
    throw new IntorError({
      id,
      code: IntorErrorCode.MISSING_DEFAULT_LOCALE,
      message: `The defaultLocale is undefined`,
    });
  }

  // Throw error if defaultLocale is not listed in supportedLocales
  if (!supportedLocales.includes(defaultLocale)) {
    throw new IntorError({
      id,
      code: IntorErrorCode.UNSUPPORTED_DEFAULT_LOCALE,
      message: `The defaultLocale "${defaultLocale}" is not included in the supportedLocales.`,
    });
  }

  return defaultLocale;
};
