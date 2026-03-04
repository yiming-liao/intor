import type { ASTNode } from "../ast";
import type { Renderer } from "./types";

/**
 * Render a semantic AST using the given renderer.
 *
 * - Recursively traverses the AST structure
 * - Delegates all output decisions to the renderer
 * - Environment-agnostic
 *
 * This function performs no parsing or transformation;
 * it strictly maps structure to output.
 */
export function render<Output>(
  nodes: ASTNode[],
  renderer: Renderer<Output>,
): Output[] {
  return nodes.map((node) => {
    switch (node.type) {
      // Plain text node
      case "text": {
        return renderer.text(node.value);
      }

      // Semantic tag node
      case "tag": {
        const children = render(node.children, renderer);
        return renderer.tag(node.name, node.attributes, children);
      }

      // Raw message value
      case "raw": {
        return renderer.raw(node.value);
      }
    }
  });
}
