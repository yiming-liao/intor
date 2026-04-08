import type { ReplacementUsage, InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { getNodeAtPath } from "../../utils/get-node-at-path";
import { resolveKeyPath } from "../../utils/resolve-key-path";

/**
 * @example
 * ```ts
 * // Expected:
 * t("hello", { name })
 *
 * // Received:
 * t("hello", { name, phone })
 * ```
 */
export function replacementUnexpected(
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
  const unexpected = actual.filter((name) => !expected.includes(name));

  if (unexpected.length > 0) {
    return [
      {
        origin: method,
        messageKey: keyPath,
        code: DIAGNOSTIC_MESSAGES.REPLACEMENTS_UNEXPECTED.code,
        message:
          DIAGNOSTIC_MESSAGES.REPLACEMENTS_UNEXPECTED.message(unexpected),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
