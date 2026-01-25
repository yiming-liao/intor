import type { SvelteTagRenderers } from "../render";
import type { Replacement, Translator } from "intor-translator";
import { renderRichMessageSvelte } from "../render";

/**
 * Create a Svelte-specific rich translation function.
 *
 * This adapter bridges the core Translator with the Svelte rich
 * message rendering flow.
 *
 * - Resolves translated messages via `translator.t`
 * - Renders semantic tags using Svelte renderers
 * - Supports optional scoped keys via `preKey`
 *
 * Intended for Svelte client usage only.
 */
export const createTRich = (translator: Translator, preKey?: string) => {
  const t = preKey ? translator.scoped(preKey).t : translator.t;

  return (
    key: string,
    tagRenderers?: SvelteTagRenderers,
    replacements?: Replacement,
  ) => {
    const message = t(key, replacements);
    return renderRichMessageSvelte(message, tagRenderers);
  };
};
