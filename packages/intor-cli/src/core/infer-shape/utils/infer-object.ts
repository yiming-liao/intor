import type { InferNode } from "../types";
import type { MessageObject, MessageValue } from "intor";
import { shouldSkipKey } from "./should-skip-key";

/**
 * Infer an object-like semantic node by aggregating inferred children.
 *
 * - Delegates inference to child nodes
 * - Prunes branches without semantic meaning
 * - Returns `none` if no children remain
 */

export function inferObject(
  value: MessageObject,
  inferChild: (value: MessageValue) => InferNode,
  mode: "messages" | "replacements" | "rich",
): InferNode {
  const properties: Record<string, InferNode> = {};

  for (const [key, val] of Object.entries(value)) {
    if (shouldSkipKey(key, mode)) continue;

    const child = inferChild(val);

    // Skip branches without semantic meaning
    if (child.kind === "none") continue;

    properties[key] = child;
  }

  return Object.keys(properties).length === 0
    ? { kind: "none" }
    : { kind: "object", properties };
}
