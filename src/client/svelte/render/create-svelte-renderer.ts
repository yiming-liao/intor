import type { SvelteTagRenderers } from "./types";
import type { Renderer } from "intor-translator";
import { escapeHtml } from "./utils/escape-html";
import { renderAttributes } from "./utils/render-attributes";

/**
 * Create a Svelte renderer for semantic rich messages.
 *
 * - Transforms semantic AST nodes into HTML strings.
 * - Intended to be used with {@html ...} in Svelte templates.
 *
 * This renderer is intentionally minimal and stateless.
 */
export const createSvelteRenderer = (options?: {
  /** Optional custom renderers for semantic tags */
  tagRenderers?: SvelteTagRenderers;
}): Renderer<string> => {
  const { tagRenderers } = options ?? {};

  return {
    /** Render plain text nodes */
    text(value) {
      return escapeHtml(value);
    },

    /** Render semantic tag nodes */
    tag(name, attributes, children) {
      const tagRenderer = tagRenderers?.[name];
      if (tagRenderer) {
        return typeof tagRenderer === "function"
          ? tagRenderer(children)
          : tagRenderer;
      }

      // Default behavior: render as native HTML tag
      return `<${name}${renderAttributes(attributes)}>${children.join(
        "",
      )}</${name}>`;
    },

    /** Render raw (non-tokenized) message values as escaped HTML strings */
    raw(value) {
      if (value == null) return "";
      if (typeof value === "string" || typeof value === "number") {
        return escapeHtml(String(value));
      }
      if (Array.isArray(value)) {
        return value.map((v) => escapeHtml(String(v))).join("");
      }
      throw new Error(
        "[intor] Svelte renderer cannot render raw non-string values. ",
      );
    },
  };
};
