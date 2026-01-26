import type { VueTagRenderers } from "./types";
import type { Renderer } from "intor-translator";
import type { VNodeChild } from "vue";
import { h } from "vue";

/**
 * Create a Vue renderer for semantic rich messages.
 */
export const createVueRenderer = (
  tagRenderers?: VueTagRenderers,
): Renderer<VNodeChild> => {
  return {
    /** Render plain text nodes */
    text(value) {
      return value;
    },

    /** Render semantic tag nodes */
    tag(name, _attributes, children) {
      const tagRenderer = tagRenderers?.[name];
      if (tagRenderer) {
        return typeof tagRenderer === "function"
          ? tagRenderer(children)
          : tagRenderer;
      }

      // Default behavior: render as a native Vue element
      return h(name, null, children);
    },

    /** Render raw (non-tokenized) message values */
    raw(value) {
      return value as VNodeChild;
    },
  };
};
