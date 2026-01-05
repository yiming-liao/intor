import type { TranslateConfig } from "intor-translator";

// Translator options
export type TranslatorOptions = {
  /** Message displayed while a translation is loading. */
  loadingMessage?: TranslateConfig["loadingMessage"];
  /** Message displayed when a translation key is missing. */
  missingMessage?: TranslateConfig["missingMessage"];
};
