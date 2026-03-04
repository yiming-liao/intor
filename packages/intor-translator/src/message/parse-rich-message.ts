import type { MessageValue } from "../types";
import { buildAST, type ASTNode } from "./ast";
import { tokenize } from "./tokenize";

/**
 * Parse a rich message value into a semantic AST.
 *
 * This is the main entry point for processing translated messages that may
 * contain semantic markup (e.g. <b>, <a>, <i>) or non-string values.
 *
 * Behavior by message type:
 * - string        → tokenized and parsed into semantic AST
 * - number/boolean → stringified, then tokenized and parsed
 * - array         → recursively flattened and parsed
 * - object        → preserved as a raw AST node
 *
 * The returned AST is renderer-agnostic and represents semantic structure only.
 */
export function parseRichMessage(message: MessageValue): ASTNode[] {
  // Null or undefined produces no output
  if (message == null) return [];

  // Tokenizable string message
  if (typeof message === "string") {
    const tokens = tokenize(message);
    return buildAST(tokens);
  }

  // Primitive values are stringified before parsing
  if (typeof message === "number" || typeof message === "boolean") {
    const tokens = tokenize(String(message));
    return buildAST(tokens);
  }

  // Arrays are recursively flattened
  if (Array.isArray(message)) {
    return message.flatMap((m: MessageValue) => parseRichMessage(m));
  }

  // Non-tokenizable objects are preserved as raw nodes
  return [
    {
      type: "raw",
      value: message,
    },
  ];
}
