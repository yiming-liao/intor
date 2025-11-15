import type { IntorRawConfig } from "@/modules/config/types/intor-config.types";
import { IntorError, IntorErrorCode } from "@/shared/error";

/**
 * Validate and resolve supported locales.
 * Throws error if loader is used without supportedLocales.
 * Falls back to message keys if supportedLocales is undefined.
 */
export const validateSupportedLocales = (
  config: IntorRawConfig,
): readonly string[] => {
  const { id, loader, supportedLocales } = config;

  // Ensure supportedLocales is set when using loader
  if (loader && !supportedLocales) {
    throw new IntorError({
      id,
      code: IntorErrorCode.MISSING_SUPPORTED_LOCALES,
      message: `"supportedLocales" is required when using loader, but it is missing.`,
    });
  }

  // Return supportedLocales or infer from message keys
  return supportedLocales || Object.keys(config.messages || {});
};
