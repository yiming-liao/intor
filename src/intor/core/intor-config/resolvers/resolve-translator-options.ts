import type {
  InitTranslatorOptions,
  ResolvedTranslatorOptions,
} from "@/intor/core/intor-config/types/translator-options.types";
import { EMPTY_OBJECT } from "@/intor/constants/shared.constants";
import { DEFAULT_TRANSLATOR_OPTIONS } from "@/intor/constants/translator-options.constants";

/**
 * Resolves translator options by merging the default translator options with the provided custom options.
 * This ensures that any customizations to the translator behavior are applied,
 * while retaining default values for the rest of the settings.
 *
 * @param {InitTranslatorOptions} [translator={}] - The custom translator options to override the defaults.
 *   It should be an object that may contain properties like `language`, `fallbackLocale`, etc.
 *   If not provided, the default values will be used.
 * @returns {ResolvedTranslatorOptions} - The resolved translator options, which combines the default and custom options.
 *   This includes all options required to configure the translator, with defaults applied where necessary.
 */
export const resolveTranslatorOptions = (
  translator: InitTranslatorOptions = EMPTY_OBJECT,
): ResolvedTranslatorOptions => {
  return {
    ...DEFAULT_TRANSLATOR_OPTIONS,
    ...translator,
  };
};
