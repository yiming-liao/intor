import type { IntorLogger } from "../../../core/intor-logger/intor-logger";
import type { Locale } from "../../../types/message-structure-types";
import type { IntorInitConfig } from "../types/define-intor-config-types";
import { IntorError, IntorErrorCode } from "../../../core/intor-error";

type ValidateDefaultLocaleOptions = {
  config: IntorInitConfig;
  supportedLocales?: readonly Locale[];
  logger: IntorLogger;
};

export const validateDefaultLocale = ({
  config,
  supportedLocales,
  logger: baseLogger,
}: ValidateDefaultLocaleOptions) => {
  const { id, defaultLocale } = config;
  const logger = baseLogger.child({ prefix: "validateDefaultLocale" });

  // Throw error if defaultLocale is undefined
  if (!defaultLocale) {
    void logger.error("The defaultLocale is undefined.", { defaultLocale });
    throw new IntorError({
      id,
      code: IntorErrorCode.MISSING_DEFAULT_LOCALE,
      message: `The defaultLocale is undefined`,
    });
  }

  // Throw error if defaultLocale is not listed in supportedLocales
  if (!supportedLocales?.includes(defaultLocale)) {
    void logger.error(
      "The defaultLocale is not included in the supportedLocales.",
      {
        defaultLocale,
        supportedLocales,
      },
    );
    throw new IntorError({
      id,
      code: IntorErrorCode.UNSUPPORTED_DEFAULT_LOCALE,
      message: `The defaultLocale "${defaultLocale}" is not included in the supportedLocales.`,
    });
  }

  return defaultLocale;
};
