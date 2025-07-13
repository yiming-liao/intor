import type { IntorInitConfig } from "../types/define-intor-config-types";
import { Locale } from "intor-translator";
import { IntorError, IntorErrorCode } from "@/modules/intor-error";

type ValidateDefaultLocaleOptions = {
  config: IntorInitConfig;
  supportedLocales?: readonly Locale[];
};

export const validateDefaultLocale = ({
  config,
  supportedLocales,
}: ValidateDefaultLocaleOptions) => {
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
  if (!supportedLocales?.includes(defaultLocale)) {
    throw new IntorError({
      id,
      code: IntorErrorCode.UNSUPPORTED_DEFAULT_LOCALE,
      message: `The defaultLocale "${defaultLocale}" is not included in the supportedLocales.`,
    });
  }

  return defaultLocale;
};
