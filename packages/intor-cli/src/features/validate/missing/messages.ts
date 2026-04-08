import type { MissingResult } from "./types";
import type { InferNode } from "../../../core";
import type { MessageObject } from "intor";

/**
 * Collect missing message keys from a locale message object.
 */
export function collectMissingMessages(
  shapes: InferNode,
  messageObject: MessageObject,
  result: MissingResult,
  path?: string,
) {
  // -----------------------------------------------------------------------
  // Skip non-object shapes because only object nodes define required keys
  // -----------------------------------------------------------------------
  if (shapes.kind !== "object") return;

  // -----------------------------------------------------------------------
  // Traverse schema-defined keys and validate message presence
  // -----------------------------------------------------------------------
  for (const key of Object.keys(shapes.properties)) {
    const node = shapes.properties[key];
    if (!node) continue;

    const value = messageObject[key];
    const fullPath = path ? `${path}.${key}` : key;

    // Shape requires this key, but message does not provide it
    if (value === undefined) {
      result.missingMessages.push(fullPath);
      continue;
    }

    // Recurse into nested message objects
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      collectMissingMessages(node, value as MessageObject, result, fullPath);
    }
  }
}
