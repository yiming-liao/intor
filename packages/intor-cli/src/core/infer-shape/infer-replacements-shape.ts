import type { InferNode } from "./types";
import type { MessageObject, MessageValue } from "intor";
import { extractInterpolationNames } from "./utils/extract-interpolation-names";
import { inferObject } from "./utils/infer-object";
import { isMessageObject } from "./utils/is-message-object";

/**
 * Infer the semantic shape of interpolation replacements from a message object.
 */
export function inferReplacementsShape(messages: MessageObject): InferNode {
  if (!isMessageObject(messages) || Object.keys(messages).length === 0) {
    return { kind: "none" };
  }
  return inferValue(messages);
}

/**
 * - Strings are scanned for `{...}` interpolations
 * - Objects are traversed recursively
 * - Arrays and unsupported values are ignored
 */
function inferValue(value: MessageValue): InferNode {
  // ----------------------------------------------------------------------
  // String values (replacement source)
  // ----------------------------------------------------------------------
  if (typeof value === "string") {
    const names = extractInterpolationNames(value);

    // No replacements found
    if (names.length === 0) {
      return { kind: "none" };
    }

    const properties: Record<string, InferNode> = {};
    for (const name of names) {
      properties[name] = { kind: "primitive", type: "string" };
    }

    return { kind: "object", properties };
  }

  // ----------------------------------------------------------------------
  // Array values (semantically irrelevant for replacements)
  // ----------------------------------------------------------------------
  if (Array.isArray(value)) {
    return { kind: "none" };
  }

  // ----------------------------------------------------------------------
  // Object values (delegate aggregation & pruning)
  // ----------------------------------------------------------------------
  if (isMessageObject(value)) {
    return inferObject(value, inferValue, "replacements");
  }

  // Fallback
  return { kind: "none" };
}
