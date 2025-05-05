import type { IntorInitConfig } from "@/intor/core/intor-config/types/define-intor-config.types";
import type { IntorLogger } from "@/intor/core/intor-logger/intor-logger";
import { IntorError, IntorErrorCode } from "@/intor/core/intor-error";

type ValidateSupportedLocalesOptions = {
  config: IntorInitConfig;
  logger: IntorLogger;
};

/**
 * Validate and resolve supported locales.
 * Throws error if loaderOptions is used without supportedLocales.
 * Falls back to message keys if supportedLocales is undefined.
 */
export const validateSupportedLocales = ({
  config,
  logger,
}: ValidateSupportedLocalesOptions): readonly string[] => {
  const { id, loaderOptions, supportedLocales } = config;

  // Ensure supportedLocales is set when using loaderOptions
  if (loaderOptions && !supportedLocales) {
    logger.error(
      "supportedLocales is required when using loaderOptions, but it is missing:",
      {
        supportedLocales: supportedLocales,
      },
    );
    throw new IntorError({
      id,
      code: IntorErrorCode.MISSING_SUPPORTED_LOCALES,
      message: `"supportedLocales" is required when using "loaderOptions", but it is missing.`,
    });
  }

  // Return supportedLocales or infer from message keys
  return supportedLocales || Object.keys(config.messages || {});
};
