import type { MessageValue } from "../types";
import type { Renderer } from "./render/types";
import { parseRichMessage } from "./parse-rich-message";
import { render } from "./render/render";

/**
 * Render a rich message value into a concrete output using the given renderer.
 *
 * This function is the main entry point of the rich message pipeline.
 * It orchestrates the full flow from message value to rendered output:
 *
 * - MessageValue ⬇
 *   - parse into semantic AST
 *   - render AST via the provided renderer
 *
 * All rendering behavior is delegated to the renderer, making this function
 * fully environment-agnostic (e.g. string, DOM, React).
 *
 * @public
 */
export function renderRichMessage<Output>(
  message: MessageValue,
  renderer: Renderer<Output>,
): Output[] {
  const nodes = parseRichMessage(message);
  return render(nodes, renderer);
}
