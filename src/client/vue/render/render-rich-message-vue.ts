import type { VueTagRenderers } from "./types";
import type { VNodeChild } from "vue";
import { renderRichMessage, type MessageValue } from "intor-translator";
import { createVueRenderer } from "./create-vue-renderer";

/**
 * Render a rich-formatted message into Vue VNodes.
 *
 * This is a Vue-specific convenience wrapper that:
 * - Parses and renders a rich message using the core render pipeline
 * - Applies optional semantic tag renderers
 * - Ensures stable VNode structure at the top level
 *
 * This function is intended for Vue environments only.
 */
export function renderRichMessageVue(
  message: MessageValue,
  tagRenderers?: VueTagRenderers,
): VNodeChild[] {
  const vueRenderer = createVueRenderer(tagRenderers);
  return renderRichMessage(message, vueRenderer);
}
