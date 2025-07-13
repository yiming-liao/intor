import type { IntorInitConfig } from "../types/define-intor-config-types";
import { IntorError, IntorErrorCode } from "@/modules/intor-error";

type ValidateSupportedLocalesOptions = {
  config: IntorInitConfig;
};

/**
 * Validate and resolve supported locales.
 * Throws error if loaderOptions is used without supportedLocales.
 * Falls back to message keys if supportedLocales is undefined.
 */
export const validateSupportedLocales = ({
  config,
}: ValidateSupportedLocalesOptions): readonly string[] => {
  const { id, loaderOptions, supportedLocales } = config;

  // Ensure supportedLocales is set when using loaderOptions
  if (loaderOptions && !supportedLocales) {
    throw new IntorError({
      id,
      code: IntorErrorCode.MISSING_SUPPORTED_LOCALES,
      message: `"supportedLocales" is required when using loaderOptions, but it is missing.`,
    });
  }

  // Return supportedLocales or infer from message keys
  return supportedLocales || Object.keys(config.messages || {});
};
