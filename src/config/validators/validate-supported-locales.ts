import type { IntorRawConfig } from "@/config";
import { IntorError, IntorErrorCode } from "@/core";

/**
 * Validates and resolves the list of supported locales.
 *
 * - Ensures `supportedLocales` is explicitly provided when a loader is used.
 * - Falls back to inferring locales from static message keys when no loader
 *   is configured.
 *
 * This validation runs during configuration initialization and is expected
 * to fail fast when required inputs are missing.
 */
export const validateSupportedLocales = (
  config: IntorRawConfig,
): readonly string[] => {
  const { id, supportedLocales } = config;

  const hasAnyLoader =
    !!config.loader || !!config.server?.loader || !!config.client?.loader;

  // Ensure supportedLocales is set when using loader
  if (hasAnyLoader && !supportedLocales) {
    throw new IntorError({
      id,
      code: IntorErrorCode.MISSING_SUPPORTED_LOCALES,
      message: `"supportedLocales" is required when using message loaders. 
                 Please specify all supported locales explicitly.`,
    });
  }

  // Return supportedLocales or infer from message keys
  return supportedLocales || Object.keys(config.messages || {});
};
