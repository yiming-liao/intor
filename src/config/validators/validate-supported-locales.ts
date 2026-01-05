import type { IntorRawConfig } from "@/config";
import { IntorError, IntorErrorCode } from "@/core";

/**
 * Validates that supportedLocales is provided and non-empty.
 *
 * Fails fast when missing.
 */
export const validateSupportedLocales = (
  id: string,
  supportedLocales: IntorRawConfig["supportedLocales"],
): readonly string[] => {
  if (!supportedLocales || supportedLocales.length === 0) {
    throw new IntorError({
      id,
      code: IntorErrorCode.MISSING_SUPPORTED_LOCALES,
      message: `"supportedLocales" must be specified.`,
    });
  }

  return supportedLocales;
};
