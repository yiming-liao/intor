import type { IntorRawConfig } from "@/config/types/intor-config.types";
import type { Locale } from "intor-translator";
import { IntorError, IntorErrorCode } from "@/shared/error";

export const validateDefaultLocale = (
  config: IntorRawConfig,
  supportedLocales: readonly Locale[],
) => {
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
