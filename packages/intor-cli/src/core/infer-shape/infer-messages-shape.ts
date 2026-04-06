import type { InferNode } from "./types";
import type { MessageObject, MessageValue } from "intor";
import { inferObject } from "./utils/infer-object";
import { isMessageObject } from "./utils/is-message-object";

/**
 * Infer the semantic shape of message values from a message object.
 */
export function inferMessagesShape(messages: MessageObject): InferNode {
  if (!isMessageObject(messages) || Object.keys(messages).length === 0) {
    return { kind: "none" };
  }
  return inferValue(messages);
}

/**
 * - Primitive values → primitive node
 * - Arrays → array node (first-element policy)
 * - Objects → object node (recursive, empty pruned)
 * - Unsupported → none
 */
function inferValue(value: MessageValue): InferNode {
  // ----------------------------------------------------------------------
  // Primitive values
  // ----------------------------------------------------------------------
  if (typeof value === "string") return { kind: "primitive", type: "string" };
  if (typeof value === "number") return { kind: "primitive", type: "number" };
  if (typeof value === "boolean") return { kind: "primitive", type: "boolean" };
  if (value === null) return { kind: "primitive", type: "null" };

  // ----------------------------------------------------------------------
  // Array values
  // ----------------------------------------------------------------------
  if (Array.isArray(value)) {
    const arr: readonly MessageValue[] = value;
    const first = arr[0];

    // empty array → unknown element
    if (first === undefined) {
      return { kind: "array", element: { kind: "none" } };
    }

    return { kind: "array", element: inferValue(first) };
  }

  // ----------------------------------------------------------------------
  // Object values
  // ----------------------------------------------------------------------
  if (isMessageObject(value)) {
    const result = inferObject(value, inferValue);

    // empty object → fallback record
    if (result.kind === "none") {
      return { kind: "record" };
    }

    return result;
  }

  // Fallback
  return { kind: "none" };
}
