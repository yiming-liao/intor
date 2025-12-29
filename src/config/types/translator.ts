import type { TranslateConfig } from "intor-translator";

// Translator options
export type TranslatorOptions = {
  /** Static fallback message displayed while a translation is loading. */
  loadingMessage?: TranslateConfig["loadingMessage"];
  /** Static fallback message displayed when a translation is missing. */
  missingMessage?: TranslateConfig["missingMessage"];
};
