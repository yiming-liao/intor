import type { SvelteTagRenderers } from "./types";
import { renderRichMessage } from "intor-translator";
import { createSvelteRenderer } from "./create-svelte-renderer";

/**
 * Render a rich-formatted message into an HTML string (Svelte).
 *
 * This is a Svelte-specific convenience wrapper that:
 * - Parses and renders a rich message using the core render pipeline
 * - Applies optional semantic tag renderers
 *
 * Intended to be used with {@html ...} in Svelte templates.
 */
export function renderRichMessageSvelte(
  message: string,
  tagRenderers?: SvelteTagRenderers,
): string {
  const renderer = createSvelteRenderer({ tagRenderers });
  const nodes = renderRichMessage(message, renderer);

  // Join top-level nodes into a single HTML string
  return nodes.join("");
}
