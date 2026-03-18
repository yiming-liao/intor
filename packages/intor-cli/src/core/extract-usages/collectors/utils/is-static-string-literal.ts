import type {
  Node,
  NoSubstitutionTemplateLiteral,
  StringLiteral,
  ts,
} from "ts-morph";
import { SyntaxKind } from "ts-morph";

/**
 * Check whether a node is a static string literal.
 *
 * Supports:
 * - "text"
 * - 'text'
 * - \`text\` (no substitutions)
 */
export function isStaticStringLiteral(
  node: Node<ts.Node> | undefined,
): node is StringLiteral | NoSubstitutionTemplateLiteral {
  if (!node) return false;

  return (
    node.isKind(SyntaxKind.StringLiteral) ||
    node.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)
  );
}
