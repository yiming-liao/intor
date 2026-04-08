import type { KeyUsage, RichUsage, InferNode } from "../../../../core";
import type { Diagnostic } from "../types";
import { DIAGNOSTIC_MESSAGES } from "../messages";
import { getNodeAtPath } from "../utils/get-node-at-path";
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
  shape: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;
  const diagnostics: Diagnostic[] = [];

  const keyPath = resolveKeyPath(key, preKey);
  if (!keyPath) return diagnostics;

  // Rich tags provided elsewhere
  if (richIndex.has(`${method}::${keyPath}`)) return diagnostics;

  const node = getNodeAtPath(shape, keyPath);

  // No rich schema defined
  if (!node || node.kind !== "object") return diagnostics;

  const expected: string[] = Object.keys(node.properties);

  // No required rich tags
  if (expected.length === 0) return diagnostics;

  diagnostics.push({
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
