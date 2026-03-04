import {
  renderRichMessage,
  type LocaleMessages,
  type Replacement,
  type TranslatorMethods,
} from "intor-translator";
import { createHtmlRenderer, type TagRenderers } from "../render";

/**
 * Create an HTML-string rich translation function.
 *
 * - Resolves translated messages via `translator.t`
 * - Renders semantic rich tags into escaped HTML strings
 * - Supports optional scoped keys via `preKey`
 *
 * Can be used in any HTML-based environment (Astro, Svelte, SSR, etc.).
 */
export const createTRich = (t: TranslatorMethods<LocaleMessages>["t"]) => {
  return (
    key: string,
    tagRenderers?: TagRenderers,
    replacements?: Replacement,
  ) => {
    const message = t(key, replacements);
    const renderer = createHtmlRenderer(tagRenderers);
    const nodes = renderRichMessage(message, renderer);
    return nodes.join("");
  };
};
