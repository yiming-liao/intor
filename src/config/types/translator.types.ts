import type { TranslateConfig } from "intor-translator";

// Translator options
export type TranslatorOptions = {
  /** Static fallback message displayed while translations are loading. */
  loadingMessage?: TranslateConfig["loadingMessage"];
  /** Static placeholder used when a message cannot be found. */
  placeholder?: TranslateConfig["placeholder"];
};
