import type { MissingRequirements } from "./collect-missing-requirements";
import type { InferNode } from "../../../core";
import type { MessageObject } from "intor";

export function collectMissingMessages(
  schema: InferNode,
  messages: MessageObject,
  path: string,
  result: MissingRequirements,
) {
  // Only object schemas define required message keys
  if (schema.kind !== "object") return;

  // Traverse schema-defined keys and validate message presence
  for (const key of Object.keys(schema.properties)) {
    const nextPath = path ? `${path}.${key}` : key;
    const expected = schema.properties[key];
    if (!expected) continue;
    const value = messages[key];

    // Schema requires this key, but message does not provide it
    if (value === undefined) {
      result.missingMessages.push(nextPath);
      continue;
    }

    // Recurse into nested message objects
    if (typeof value === "object" && value !== null) {
      collectMissingMessages(
        expected,
        value as MessageObject,
        nextPath,
        result,
      );
    }
  }
}
