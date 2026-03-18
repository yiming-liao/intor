import type { MissingRequirements } from "./collect-missing-requirements";
import type { InferNode } from "../../../core";
import type { MessageObject } from "intor";
import { extractInterpolationNames } from "../../../core";

export function collectMissingReplacements(
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
    if (value === undefined) continue;

    // ------------------------------------------------------------
    // Leaf string message: validate interpolation replacements
    // ------------------------------------------------------------
    if (typeof value === "string") {
      if (expected.kind !== "object") continue;

      const actualNames = extractInterpolationNames(value);

      // Report any schema-required replacements missing in the message
      for (const name of Object.keys(expected.properties)) {
        if (actualNames.includes(name)) continue;
        result.missingReplacements.push({ key: nextPath, name });
      }

      continue;
    }

    // Recurse into nested message objects
    if (typeof value === "object" && value !== null) {
      collectMissingReplacements(
        expected,
        value as MessageObject,
        nextPath,
        result,
      );
    }
  }
}
