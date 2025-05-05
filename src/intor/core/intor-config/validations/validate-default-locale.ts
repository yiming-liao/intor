import type { IntorInitConfig } from "@/intor/core/intor-config/types/define-intor-config.types";
import type { IntorLogger } from "@/intor/core/intor-logger/intor-logger";
import type {
  LocaleNamespaceMessages,
  RawLocale,
} from "@/intor/types/message-structure-types";
import { IntorError, IntorErrorCode } from "@/intor/core/intor-error";

type ValidateDefaultLocaleOptions<Messages extends LocaleNamespaceMessages> = {
  config: IntorInitConfig;
  supportedLocales?: readonly RawLocale<Messages>[];
  logger: IntorLogger;
};

export const validateDefaultLocale = <
  Messages extends LocaleNamespaceMessages,
>({
  config,
  supportedLocales,
  logger,
}: ValidateDefaultLocaleOptions<Messages>) => {
  const { id, defaultLocale } = config;

  // Throw error if defaultLocale is undefined
  if (!defaultLocale) {
    logger.error("The defaultLocale is undefined:", { defaultLocale });
    throw new IntorError({
      id,
      code: IntorErrorCode.MISSING_DEFAULT_LOCALE,
      message: `The defaultLocale is undefined`,
    });
  }

  // Throw error if defaultLocale is not listed in supportedLocales
  if (!supportedLocales?.includes(defaultLocale)) {
    logger.error("The defaultLocale is not included in the supportedLocales:", {
      defaultLocale,
      supportedLocales,
    });
    throw new IntorError({
      id,
      code: IntorErrorCode.UNSUPPORTED_DEFAULT_LOCALE,
      message: `The defaultLocale "${defaultLocale}" is not included in the supportedLocales.`,
    });
  }

  return defaultLocale;
};
