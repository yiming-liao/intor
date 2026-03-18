import type { KeyUsage, RichUsage, InferNode } from "../../../../core";
import type { Diagnostic } from "../types";
import { DIAGNOSTIC_MESSAGES } from "../messages";
import { getSchemaNodeAtPath } from "../utils/get-schema-node-at-path";
import { resolveKeyPath } from "../utils/resolve-key-path";

/**
 * Detect missing rich when no rich usage exists anywhere.
 *
 * @example
 * ```ts
 * // Expected:
 * tRich("hello", { link })
 *
 * // Received:
 * tRich("hello") // Rich usage cannot be detected
 * ```
 */
export function enforceMissingRich(
  usage: KeyUsage,
  richIndex: Map<string, RichUsage[]>,
  richSchema: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;
  const diagnostics: Diagnostic[] = [];

  const keyPath = resolveKeyPath(key, preKey);

  // Rich tags provided elsewhere
  if (richIndex.has(`${method}::${keyPath}`)) return diagnostics;

  const schemaNode = getSchemaNodeAtPath(richSchema, keyPath);

  // No rich schema defined
  if (!schemaNode || schemaNode.kind !== "object") return diagnostics;

  const expected: string[] = Object.keys(schemaNode.properties);

  // No required rich tags
  if (expected.length === 0) return diagnostics;

  diagnostics.push({
    severity: "warn",
    origin: method,
    messageKey: keyPath,
    code: DIAGNOSTIC_MESSAGES.RICH_MISSING.code,
    message: DIAGNOSTIC_MESSAGES.RICH_MISSING.message(expected),
    file,
    line,
    column,
  });

  return diagnostics;
}
