import type { FormatDefaults } from "intor-translator";

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

  /** Optional default Intl format options. */
  formatDefaults?: FormatDefaults;
};
