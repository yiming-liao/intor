import type { IntorLogger } from "../../../core/intor-logger/intor-logger";
import type { IntorInitConfig } from "../types/define-intor-config-types";
import { IntorError, IntorErrorCode } from "../../../core/intor-error";

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
  logger: baseLogger,
}: ValidateSupportedLocalesOptions): readonly string[] => {
  const { id, loaderOptions, supportedLocales } = config;
  const logger = baseLogger.child({ prefix: "validateSupportedLocales" });

  // Ensure supportedLocales is set when using loaderOptions
  if (loaderOptions && !supportedLocales) {
    void logger.error(
      "supportedLocales is required when using loaderOptions, but it is missing.",
      { supportedLocales },
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
