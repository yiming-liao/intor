import type { ReactTagRenderers } from "./types";
import type { Renderer } from "intor-translator";
import * as React from "react";

/**
 * Create a React renderer for semantic rich messages.
 */
export const createReactRenderer = (
  tagRenderers?: ReactTagRenderers,
): Renderer<React.ReactNode> => {
  return {
    /** Render plain text nodes */
    text(value) {
      return value;
    },

    /** Render semantic tag nodes */
    tag(name, _attributes, children) {
      // Custom tag renderers override
      const tagRenderer = tagRenderers?.[name];
      if (tagRenderer) {
        return typeof tagRenderer === "function"
          ? tagRenderer(children)
          : tagRenderer;
      }

      // Default behavior: render as a native React element
      return React.createElement(name, null, ...children);
    },

    /** Render raw (non-tokenized) message values */
    raw(value) {
      return value as React.ReactNode;
    },
  };
};
