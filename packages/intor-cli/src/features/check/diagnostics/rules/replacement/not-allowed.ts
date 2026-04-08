import type { ReplacementUsage, InferNode } from "../../../../../core";
import type { Diagnostic } from "../../types";
import { DIAGNOSTIC_MESSAGES } from "../../messages";
import { getNodeAtPath } from "../../utils/get-node-at-path";
import { resolveKeyPath } from "../../utils/resolve-key-path";

/**
 * @example
 * ```ts
 * // Expected:
 * t("hello")
 *
 * // Received:
 * t("hello", { name })
 * ```
 */
export function replacementsNotAllowed(
  usage: ReplacementUsage,
  shape: InferNode,
): Diagnostic[] {
  const { method, key, preKey, file, line, column } = usage;

  const keyPath = resolveKeyPath(key, preKey);
  if (!keyPath) return [];

  const node = getNodeAtPath(shape, keyPath);

  if (!node || node.kind !== "object") {
    return [
      {
        origin: method,
        messageKey: keyPath,
        code: DIAGNOSTIC_MESSAGES.REPLACEMENTS_NOT_ALLOWED.code,
        message: DIAGNOSTIC_MESSAGES.REPLACEMENTS_NOT_ALLOWED.message(),
        file,
        line,
        column,
      },
    ];
  }

  return [];
}
