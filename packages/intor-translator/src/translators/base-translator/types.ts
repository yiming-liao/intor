import type { Locale } from "../../types";

/**
 * Options for initializing a `BaseTranslator` instance.
 *
 * Defines the minimal runtime state required for translation.
 *
 * @public
 */
export interface BaseTranslatorOptions<M = unknown> {
  /** Translations messages. */
  messages?: Readonly<M>;
  /** Current locale key. */
  locale: Locale<M>;
  /** Indicates whether the translator is in a loading state. */
  isLoading?: boolean;
}
