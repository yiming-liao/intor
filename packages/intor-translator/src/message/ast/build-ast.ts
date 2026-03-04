import type { Token } from "../tokenize";
import type { ASTNode, TagNode } from "./types";

/**
 * Build a semantic AST from a flat token stream.
 *
 * - Converts opening/closing tag tokens into nested tag nodes
 * - Preserves plain text as text nodes
 * - Validates tag structure (unmatched / unclosed tags)
 *
 * This function assumes tokens are already syntactically valid
 * and focuses purely on structural correctness.
 */
export function buildAST(tokens: Token[]): ASTNode[] {
  const root: ASTNode[] = [];
  const stack: TagNode[] = [];

  // Append a node to the current parent, or to the root if none
  const pushNode = (node: ASTNode) => {
    const parent = stack.at(-1);
    if (parent) {
      parent.children.push(node);
    } else {
      root.push(node);
    }
  };

  for (const token of tokens) {
    switch (token.type) {
      case "text": {
        pushNode({
          type: "text",
          value: token.value,
        });
        break;
      }

      case "tag-open": {
        const node: ASTNode = {
          type: "tag",
          name: token.name,
          attributes: token.attributes,
          children: [],
        };
        pushNode(node);
        stack.push(node);
        break;
      }

      case "tag-close": {
        const last = stack.pop();
        // No corresponding opening tag, or tag nesting mismatch
        if (!last || last.name !== token.name) {
          throw new Error(
            `Unmatched closing tag </${token.name}> at position ${token.position}`,
          );
        }
        break;
      }
    }
  }

  // Any remaining tags indicate an unclosed structure
  if (stack.length > 0) {
    throw new Error(`Unclosed tag detected: <${stack.at(-1)?.name}>`);
  }

  return root;
}
