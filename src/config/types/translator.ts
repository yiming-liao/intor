/**
 * Translator behavior configuration.
 *
 * @public
 */
export type TranslatorOptions = {
  /** Message displayed while a translation is loading. */
  loadingMessage?: string;

  /** Message displayed when a translation key is missing. */
  missingMessage?: string;
};
