import type { VueTagRenderers } from "../render";
import {
  renderRichMessage,
  type LocaleMessages,
  type Replacement,
  type TranslatorMethods,
} from "intor-translator";
import { createVueRenderer } from "../render";

/**
 * Create a Vue-specific rich translation function.
 *
 * This adapter bridges the core Translator with the Vue rich
 * message rendering flow.
 *
 * - Resolves translated messages via `translator.t`
 * - Renders semantic tags using Vue renderers
 * - Supports optional scoped keys via `preKey`
 *
 * Intended for Vue client usage only.
 */
export const createTRich = (t: TranslatorMethods<LocaleMessages>["t"]) => {
  return (
    key: string,
    tagRenderers?: VueTagRenderers,
    replacements?: Replacement,
  ) => {
    const message = t(key, replacements);
    const vueRenderer = createVueRenderer(tagRenderers);
    return renderRichMessage(message, vueRenderer);
  };
};
