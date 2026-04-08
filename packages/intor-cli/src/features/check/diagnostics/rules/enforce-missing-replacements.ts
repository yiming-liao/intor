import type { KeyUsage, ReplacementUsage, InferNode } from "../../../../core";
import type { Diagnostic } from "../types";
import { DIAGNOSTIC_MESSAGES } from "../messages";
import { getNodeAtPath } from "../utils/get-node-at-path";
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
  shape: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;
  const diagnostics: Diagnostic[] = [];

  const keyPath = resolveKeyPath(key, preKey);
  if (!keyPath) return diagnostics;

  // Replacements provided elsewhere
  if (replacementIndex.has(`${usage.method}::${keyPath}`)) return diagnostics;

  const node = getNodeAtPath(shape, keyPath);

  // No replacement schema defined
  if (!node || node.kind !== "object") return diagnostics;

  const expected: string[] = Object.keys(node.properties);

  // No required replacements
  if (expected.length === 0) return diagnostics;

  diagnostics.push({
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
