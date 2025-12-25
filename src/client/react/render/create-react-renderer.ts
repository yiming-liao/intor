import type { ReactTagRenderers } from "./types";
import type { Renderer } from "intor-translator";
import { createElement } from "react";

/**
 * Create a React renderer for semantic rich messages.
 *
 * Transforms semantic AST nodes into React nodes.
 * Used together with `render` / `renderRichMessage`.
 *
 * - Text nodes → plain strings
 * - Tag nodes → custom renderer or native element
 *
 * This renderer is intentionally minimal and stateless.
 */
export const createReactRenderer = (options?: {
  /** Optional custom renderers for semantic tags */
  tagRenderers?: ReactTagRenderers;
}): Renderer<React.ReactNode> => {
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

      // Default behavior: render as a native React element
      return createElement(name, attributes, ...children);
    },
  };
};
