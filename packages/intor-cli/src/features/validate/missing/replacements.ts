import type { MissingResult } from "./types";
import type { InferNode } from "../../../core";
import type { MessageObject } from "intor";
import { extractInterpolationNames } from "../../../core";
import { findMessageValue } from "./find-message-value";

/**
 * Collect missing interpolation replacements from locale messages.
 */
export function collectMissingReplacements(
  shapes: InferNode,
  messages: MessageObject,
  result: MissingResult,
  path?: string,
) {
  // -----------------------------------------------------------------------
  // Skip non-object shapes because only object nodes define replacements
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
      collectMissingReplacements(node, messages, result, fullPath);
      continue;
    }

    // -----------------------------------------------------------------------
    // Leaf string message: validate interpolation replacements
    // -----------------------------------------------------------------------
    if (typeof value === "string") {
      if (node.kind !== "object") continue;

      const actualNames = extractInterpolationNames(value);

      // Report any shape-required replacements missing in the message
      for (const name of Object.keys(node.properties)) {
        if (actualNames.includes(name)) continue;
        result.missingReplacements.push({ key: fullPath, name });
      }
      continue;
    }

    // Recurse into nested message objects
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      collectMissingReplacements(node, messages, result, fullPath);
    }
  }
}
