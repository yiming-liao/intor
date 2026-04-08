import type { ReplacementUsage, InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { getNodeAtPath } from "../../utils/get-node-at-path";
import { resolveKeyPath } from "../../utils/resolve-key-path";

/**
 * @example
 * ```ts
 * // Expected:
 * t("hello", { name, phone })
 *
 * // Received:
 * t("hello", { name })
 * ```
 */
export function replacementMissing(
  usage: ReplacementUsage,
  shape: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;

  const keyPath = resolveKeyPath(key, preKey);
  if (!keyPath) return [];

  const node = getNodeAtPath(shape, keyPath);
  if (!node || node.kind !== "object") return [];

  const expected = Object.keys(node.properties);
  const actual = usage.replacements;
  const missing = expected.filter((name) => !actual.includes(name));

  if (missing.length > 0) {
    return [
      {
        origin: method,
        messageKey: keyPath,
        code: DIAGNOSTIC_MESSAGES.REPLACEMENTS_MISSING.code,
        message: DIAGNOSTIC_MESSAGES.REPLACEMENTS_MISSING.message(missing),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
