import type { Token } from "./types";
import { extractAttributes } from "./utils/extract-attributes";

// Matches opening semantic tags with optional attributes: <tag ...>
const OPEN_TAG_REGEX = /^<([a-zA-Z0-9_]+)([^>]*)>/;

// Matches closing semantic tags: </tag>
const CLOSE_TAG_REGEX = /^<\/([a-zA-Z0-9_]+)>/;

/**
 * Tokenize a localized message string into semantic tokens.
 *
 * Supported syntax:
 *   - <tag>text</tag>
 *   - <tag key="value">text</tag>
 *
 * Notes:
 * - Produces a flat token stream (nesting is handled in a later stage)
 * - Tag names are identifier-like and case-sensitive
 * - Attributes are strict key="value" pairs (double quotes only)
 * - Variables are assumed to be interpolated beforehand
 *
 * This tokenizer is intentionally minimal and fail-closed:
 * any unrecognized or partially valid syntax is treated as plain text.
 *
 * @public
 */
export const tokenize = (message: string): Token[] => {
  const tokens: Token[] = [];

  let pos = 0; // Current cursor position in the source message
  let buffer = ""; // Accumulates plain text until a tag boundary is reached

  // Flush buffered text as a single token, if any
  const flushText = () => {
    if (!buffer) return;
    tokens.push({
      type: "text",
      value: buffer,
      position: pos - buffer.length,
    });
    buffer = "";
  };

  while (pos < message.length) {
    const char = message[pos];

    if (char === "<") {
      // Attempt to match an opening tag with optional attributes: <tag ...>
      const openMatch = message.slice(pos).match(OPEN_TAG_REGEX);
      if (openMatch) {
        const name = openMatch[1]!;
        const rawAttributes = openMatch[2]!;
        const attributes = extractAttributes(rawAttributes); // {} = no attributes, null = invalid syntax

        if (attributes) {
          flushText();
          tokens.push({
            type: "tag-open",
            name,
            attributes,
            position: pos,
          });
          pos += openMatch[0].length;
          continue;
        }
        // Invalid attributes → treat entire sequence as plain text
      }

      // Attempt to match a closing tag: </tag>
      const closeMatch = message.slice(pos).match(CLOSE_TAG_REGEX);
      if (closeMatch) {
        const name = closeMatch[1]!;
        flushText();
        tokens.push({
          type: "tag-close",
          name,
          position: pos,
        });
        pos += closeMatch[0].length;
        continue;
      }
    }

    // Fallback: consume current character as text
    buffer += char;
    pos += 1;
  }

  flushText();
  return tokens;
};
