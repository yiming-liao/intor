import type { VueTagRenderers } from "@/client/vue/render";
import type { Replacement, Translator } from "intor-translator";
import { computed, type ComputedRef } from "vue";
import { renderRichMessageVue } from "@/client/vue/render";

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
export const createTRich = (
  translator: ComputedRef<Translator>,
  preKey?: string,
) => {
  const t = computed(() => {
    return preKey ? translator.value.scoped(preKey).t : translator.value.t;
  });

  return (
    key: string,
    tagRenderers?: VueTagRenderers,
    replacements?: Replacement,
  ) => {
    const message = t.value(key, replacements);
    return renderRichMessageVue(message, tagRenderers);
  };
};
