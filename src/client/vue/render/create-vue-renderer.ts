import type { VueTagRenderers } from "./types";
import type { Renderer } from "intor-translator";
import type { VNodeChild } from "vue";
import { h } from "vue";

/**
 * Create a Vue renderer for semantic rich messages.
 *
 * Transforms semantic AST nodes into Vue VNodes.
 * Used together with `render` / `renderRichMessage`.
 *
 * - Text nodes → plain strings
 * - Tag nodes → custom renderer or native element
 * - Raw nodes → rendered as-is by the renderer
 *
 * This renderer is intentionally minimal and stateless.
 */
export const createVueRenderer = (options?: {
  /** Optional custom renderers for semantic tags */
  tagRenderers?: VueTagRenderers;
}): Renderer<VNodeChild> => {
  const { tagRenderers } = options ?? {};

  return {
    /** Render plain text nodes */
    text(value) {
      return value;
    },

    /** Render semantic tag nodes */
    tag(name, attributes, children) {
      const renderer = tagRenderers?.[name];

      // Custom tag renderer
      if (renderer) {
        return typeof renderer === "function"
          ? renderer(children, attributes)
          : renderer;
      }

      // Default behavior: render as a native Vue element
      return h(name, attributes, children);
    },

    /** Render raw (non-tokenized) message values */
    raw(value) {
      return value as VNodeChild;
    },
  };
};
