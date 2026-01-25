import type { SvelteTagRenderers } from "../render";
import type { Replacement, Translator } from "intor-translator";
import { derived, get, type Readable } from "svelte/store";
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
export const createTRich = (
  translator: Readable<Translator>,
  preKey?: string,
) => {
  const t = derived(translator, ($t) => (preKey ? $t.scoped(preKey).t : $t.t));

  return (
    key: string,
    tagRenderers?: SvelteTagRenderers,
    replacements?: Replacement,
  ) => {
    const message = get(t)(key, replacements);
    return renderRichMessageSvelte(message, tagRenderers);
  };
};
