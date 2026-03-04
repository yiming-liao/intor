import type { Attributes } from "../../types";

/**
 * Matches strictly formatted attribute pairs:
 *   - Leading whitespace is required
 *   - Attribute name must be identifier-like (a-zA-Z_, then alphanumerics/_)
 *   - Attribute value must be double-quoted
 *
 * Supported examples:
 *   - id="x"
 *   - href="/pricing"
 *
 * Rejected by design:
 *   - id=x
 *   - id='x'
 *   - disabled
 *   - id={x}
 *
 * This regex is intentionally strict to avoid ambiguous parsing.
 */
const ATTR_REGEX = /\s+([a-zA-Z_][a-zA-Z0-9_]*)="([^"]*)"/g;

/**
 * Extract tag attributes into a key-value map.
 *
 * - Only supports strict key="value" pairs.
 * - Returns `null` if the input contains any unsupported or leftover syntax.
 */
export const extractAttributes = (input: string): Attributes | null => {
  const attributes: Attributes = {};

  let match: RegExpExecArray | null;
  let consumed = "";

  while ((match = ATTR_REGEX.exec(input))) {
    const key = match[1]!;
    const value = match[2]!;
    attributes[key] = value;
    consumed += match[0];
  }

  // Fail if any part of the input was not fully consumed
  if (consumed.length !== input.length) {
    return null;
  }

  return attributes;
};
