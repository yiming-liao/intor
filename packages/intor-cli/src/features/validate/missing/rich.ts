import type { MissingResult } from "./types";
import type { InferNode } from "../../../core";
import type { MessageObject } from "intor";
import { tokenize, type Token } from "intor-translator/internal";
import { findMessageValue } from "./find-message-value";

/**
 * Check whether a token is an opening rich tag.
 */
function isTagOpenToken(
  token: Token,
): token is Token & { type: "tag-open"; name: string } {
  return token.type === "tag-open";
}

/**
 * Collect missing rich tags from locale messages.
 */
export function collectMissingRich(
  shapes: InferNode,
  messages: MessageObject,
  result: MissingResult,
  path?: string,
) {
  // -----------------------------------------------------------------------
  // Skip non-object shapes because only object nodes define rich tags
  // -----------------------------------------------------------------------
  if (shapes.kind !== "object") return;

  // -----------------------------------------------------------------------
  // Traverse schema-defined keys and validate message presence
  // -----------------------------------------------------------------------
  for (const key of Object.keys(shapes.properties)) {
    const node = shapes.properties[key];
    if (!node) continue;

    const fullPath = path ? `${path}.${key}` : key;
    const value = findMessageValue(messages, fullPath);

    if (value === undefined) {
      collectMissingRich(node, messages, result, fullPath);
      continue;
    }

    // -----------------------------------------------------------------------
    // Leaf string message: validate rich tags
    // -----------------------------------------------------------------------
    if (typeof value === "string") {
      if (node.kind !== "object") continue;

      const tokens: Token[] = tokenize(value);
      const actualTags = new Set(
        tokens.filter(isTagOpenToken).map((t) => t.name),
      );

      // Report any shape-required rich tags missing in the message
      for (const tag of Object.keys(node.properties)) {
        if (actualTags.has(tag)) continue;
        result.missingRich.push({ key: fullPath, tag });
      }
      continue;
    }

    // Recurse into nested message objects
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      collectMissingRich(node, messages, result, fullPath);
    }
  }
}
