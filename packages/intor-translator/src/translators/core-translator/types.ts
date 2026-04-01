import type { FormatDefaults } from "../../formatter";
import type { TranslateConfig, TranslateHook } from "../../pipeline";
import type { BaseTranslatorOptions } from "../base-translator";

/**
 * Options for initializing a `CoreTranslator` instance.
 *
 * Extends the base runtime options with translation behavior
 * configuration and pipeline extensions.
 *
 * @public
 */
export interface CoreTranslatorOptions<M>
  extends BaseTranslatorOptions<M>, TranslateConfig<M> {
  /** Optional plugins or raw hooks to extend the translation pipeline. */
  hooks?: Array<TranslateHook>;
  /** Optional default Intl format options applied to `translator.format` helpers. */
  formatDefaults?: FormatDefaults;
}
