import type { KeyUsage, ReplacementUsage, InferNode } from "../../../../core";
import type { Diagnostic } from "../types";
import { DIAGNOSTIC_MESSAGES } from "../messages";
import { getSchemaNodeAtPath } from "../utils/get-schema-node-at-path";
import { resolveKeyPath } from "../utils/resolve-key-path";

/**
 * Detect missing replacements when no replacement usage exists anywhere.
 *
 * @example
 * ```ts
 * // Expected:
 * t("hello", { name })
 *
 * // Received:
 * t("hello") // Replacement usage cannot be detected
 * ```
 */
export function enforceMissingReplacements(
  usage: KeyUsage,
  replacementIndex: Map<string, ReplacementUsage[]>,
  replacementsSchema: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;
  const diagnostics: Diagnostic[] = [];

  const keyPath = resolveKeyPath(key, preKey);

  // Replacements provided elsewhere
  if (replacementIndex.has(`${usage.method}::${keyPath}`)) return diagnostics;

  const schemaNode = getSchemaNodeAtPath(replacementsSchema, keyPath);

  // No replacement schema defined
  if (!schemaNode || schemaNode.kind !== "object") return diagnostics;

  const expected: string[] = Object.keys(schemaNode.properties);

  // No required replacements
  if (expected.length === 0) return diagnostics;

  diagnostics.push({
    severity: "warn",
    origin: method,
    messageKey: keyPath,
    code: DIAGNOSTIC_MESSAGES.REPLACEMENTS_MISSING.code,
    message: DIAGNOSTIC_MESSAGES.REPLACEMENTS_MISSING.message(expected),
    file,
    line,
    column,
  });

  return diagnostics;
}
