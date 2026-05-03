import type { MissingResult } from "./types";
import type { InferNode } from "../../../core";
import type { MessageObject } from "intor";
import { findMessageValue } from "./find-message-value";

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

    const fullPath = path ? `${path}.${key}` : key;
    const value = findMessageValue(messageObject, fullPath);

    if (node.kind === "object") {
      if (value === undefined) {
        collectMissingMessages(node, messageObject, result, fullPath);
        continue;
      }

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        collectMissingMessages(node, messageObject, result, fullPath);
      }
      continue;
    }

    if (value === undefined) {
      result.missingMessages.push(fullPath);
    }
  }
}
